import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import joblib
import pickle
import json
import os

# --- 1. DEFINE FILE PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# --- Data Paths ---
WAREHOUSES_CSV = os.path.join(DATA_DIR, "warehouses.csv")
LANES_CSV = os.path.join(DATA_DIR, "lanes.csv")
TRANSPORTS_CSV = os.path.join(DATA_DIR, "transports.csv")
FORECAST_DATA_CSV = os.path.join(DATA_DIR, "SyntheticSupplyChain.csv")

# --- Model Artifact Paths ---
COMPAT_MODEL_PATH = os.path.join(MODEL_DIR, "compat_model.joblib")
FORECASTER_MODEL_PATH = os.path.join(MODEL_DIR, "forecaster_decision_focused.pt")
FORECASTER_SCALER_Y_PATH = os.path.join(MODEL_DIR, "forecaster_scaler_y.pkl")
FORECASTER_FEATURES_PATH = os.path.join(MODEL_DIR, "forecaster_features.json")

# --- 2. DEFINE THE FORECASTER MODEL (LSTM) ---
class LSTMForecaster(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(LSTMForecaster, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        last_time_step_out = lstm_out[:, -1, :]
        out = self.fc(last_time_step_out) 
        return out.squeeze(-1)

# --- 3. LOAD ALL MODELS & DATA ON STARTUP ---
print("🚀 Loading all AI models and data...")

try:
    # --- Load Compatibility (Cost) Model ---
    compat_model_pipeline = joblib.load(COMPAT_MODEL_PATH)
    print("✅ Compatibility (Cost) Model loaded.")

    # --- Load Forecaster (Demand) Model ---
    # Load feature list first
    with open(FORECASTER_FEATURES_PATH, 'r') as f:
        forecaster_feature_cols = json.load(f)
    INPUT_SIZE = len(forecaster_feature_cols)

    # Define and load the PyTorch model
    HIDDEN_SIZE = 64
    NUM_LAYERS = 1
    OUTPUT_SIZE = 1
    forecaster_model = LSTMForecaster(INPUT_SIZE, HIDDEN_SIZE, NUM_LAYERS, OUTPUT_SIZE)

    # 🔧 GPU/CPU SAFE LOADING
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🧠 Using device: {device}")
    state_dict = torch.load(FORECASTER_MODEL_PATH, map_location=device)
    forecaster_model.load_state_dict(state_dict)
    forecaster_model.to(device)
    forecaster_model.eval()
    print("✅ Forecaster (Demand) Model loaded successfully.")

    # --- Load Forecaster Scaler ---
    with open(FORECASTER_SCALER_Y_PATH, 'rb') as f:
        scaler_y_data = pickle.load(f)
    FORECASTER_Y_MEAN = scaler_y_data['mean']
    FORECASTER_Y_STD = scaler_y_data['std']
    print("✅ Forecaster Scaler (Y) loaded.")

    # --- Load Data CSVs ---
    df_forecast_data = pd.read_csv(FORECAST_DATA_CSV, parse_dates=["Date"])
    df_warehouses = pd.read_csv(WAREHOUSES_CSV)
    df_lanes = pd.read_csv(LANES_CSV)
    df_transports = pd.read_csv(TRANSPORTS_CSV)
    print("✅ All data CSVs loaded into memory.")

except Exception as e:
    print(f"❌ CRITICAL ERROR: Failed to load models or data: {e}")
    compat_model_pipeline = None
    forecaster_model = None

# --- 4. HELPER FUNCTIONS (same as before) ---
def get_forecast_for_sku(sku: str, store_id: str):
    if forecaster_model is None:
        raise Exception("Forecaster model is not loaded.")

    df_history = df_forecast_data.head(30)
    df_encoded = pd.get_dummies(df_history, columns=["Region", "Weather"], drop_first=True)
    df_encoded = df_encoded.apply(pd.to_numeric, errors='coerce').fillna(0.0)
    X_data = df_encoded[forecaster_feature_cols]

    X_seq = np.array(X_data.values, dtype=np.float32)
    X_tensor = torch.tensor(X_seq).unsqueeze(0)
    
    # Use the same device as the model
    device = next(forecaster_model.parameters()).device
    X_tensor = X_tensor.to(device)

    with torch.no_grad():
        y_pred_normalized = forecaster_model(X_tensor)

    y_pred = (y_pred_normalized.item() * FORECASTER_Y_STD) + FORECASTER_Y_MEAN
    demand_forecast = np.log(1 + np.exp(y_pred))
    return demand_forecast, demand_forecast * 1.2


def get_costs_for_sku(sku: str, store_id: str, quantity: float):
    if compat_model_pipeline is None:
        raise Exception("Compatibility model is not loaded.")
    
    df_all_lanes = df_lanes.merge(df_warehouses, on="warehouse_id")
    df_all_lanes = df_all_lanes.merge(df_transports, on="transport_id")

    df_predict = df_all_lanes.copy()
    df_predict["sku"] = sku
    df_predict["store_id"] = store_id
    df_predict["qty"] = quantity

    df_predict = df_predict.rename(columns={
        "distance_km": "lane_distance_km",
        "delay_rate": "lane_delay_rate",
        "avg_lead_time_days": "lane_lead_time_days",
        "avg_procurement_cost_per_sku": "wh_procurement_cost",
        "service_score": "wh_service_score",
        "base_cost_per_km": "tr_base_cost_per_km",
        "reliability": "tr_reliability",
        "co2_kg_per_km": "tr_co2_kg_per_km"
    })
    
    predicted_unit_costs = compat_model_pipeline.predict(df_predict)
    df_predict['predicted_unit_cost'] = predicted_unit_costs
    df_predict['total_cost'] = predicted_unit_costs * quantity
    return df_predict


def solve_optimization(candidates, demand_forecast):
    best_option = candidates.loc[candidates['total_cost'].idxmin()]
    return {
        "sku": best_option["sku"],
        "forecast": demand_forecast,
        "order_quantity": best_option["qty"],
        "recommended_warehouse": best_option["warehouse_id"],
        "transport": best_option["mode"],
        "total_cost": best_option["total_cost"],
        "unit_cost": best_option["predicted_unit_cost"]
    }

def run_decision_pipeline(sku: str, store_id: str):
    try:
        demand_forecast, order_quantity = get_forecast_for_sku(sku, store_id)
        df_candidates = get_costs_for_sku(sku, store_id, order_quantity)
        decision = solve_optimization(df_candidates, demand_forecast)
        return decision
    except Exception as e:
        print(f"Error in pipeline: {e}")
        return {"error": str(e)}
