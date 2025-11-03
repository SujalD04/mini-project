import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from math import ceil

# --- 1. Initialize Flask App & Load Artifacts ---
print("--- Loading ML model and artifacts... ---")

app = Flask(__name__)
CORS(app) 

try:
    model = tf.keras.models.load_model('final_inventory_forecast_model.h5')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

scaler_X = joblib.load('scaler_X.joblib')
scaler_y = joblib.load('scaler_y.joblib')

with open('model_features.json', 'r') as f:
    feature_cols = json.load(f)

NUMERICAL_COLS = feature_cols['numerical']
CATEGORICAL_COLS = feature_cols['categorical']
CATEGORY_ID_COL = feature_cols['category_id_col']

LOOK_BACK = 45 

print("--- Model and artifacts loaded successfully. ---")

# --- 2. Helper Function: Preprocessing ---
def preprocess_input(history_data, category_id):
    """ Preprocesses data for a SINGLE item. """
    df = pd.DataFrame(history_data)
    
    for col in CATEGORICAL_COLS:
        if col not in df.columns:
            df[col] = 'Unknown' 
            
    df = pd.get_dummies(df, columns=CATEGORICAL_COLS, drop_first=True)
    
    all_feature_names = NUMERICAL_COLS.copy()
    for col in all_feature_names:
        if col not in df.columns:
            df[col] = 0 
    
    df_ordered = df[all_feature_names]
    
    X_num_scaled = scaler_X.transform(df_ordered.values) 
    X_cat = np.array(category_id)
    X_seq_num = X_num_scaled
    
    return X_seq_num, X_cat


# --- 3. Helper Function: AI Agent Logic (Phase 3) ---
def get_restock_recommendation(predicted_demand_7d, current_stock, lead_time_days):
    """ Calculates recommendation for a SINGLE item. """
    daily_demand = predicted_demand_7d / 7
    safety_stock = daily_demand * 3 
    demand_during_lead_time = daily_demand * lead_time_days
    reorder_point = demand_during_lead_time + safety_stock

    recommendation = "Hold"
    suggested_quantity = 0

    if current_stock < reorder_point:
        recommendation = "Restock"
        target_inventory = predicted_demand_7d + safety_stock
        suggested_quantity = target_inventory - current_stock
        suggested_quantity = max(0, ceil(suggested_quantity))

    return {
        "recommendation": recommendation,
        "suggested_quantity": int(suggested_quantity),
        "reorder_point": float(round(reorder_point, 2)),
        "safety_stock": float(round(safety_stock, 2)),
        "predicted_demand_next_7_days": float(round(predicted_demand_7d, 2))
    }

# --- 4. NEW HELPER: Post-processing Logic ---
def get_adjustment_factor(history_data, recent_days=7):
    """
    Calculates an adjustment factor by comparing recent sales
    to the overall average sales from the historical data.
    """
    try:
        # We use 'Lag_Sales_D-1' as our "actual sales" proxy
        all_sales = [day['Lag_Sales_D-1'] for day in history_data]
        
        if not all_sales:
            return 1.0 # No data, no adjustment

        # Calculate overall and recent averages
        overall_avg = sum(all_sales) / len(all_sales)
        recent_sales = all_sales[-recent_days:]
        recent_avg = sum(recent_sales) / len(recent_sales)

        # Prevent division by zero
        if overall_avg == 0:
            return 1.0 # No adjustment if overall average is zero
            
        # The adjustment factor
        factor = recent_avg / overall_avg
        
        # Clamp the factor to avoid extreme swings (e.g., max 50% up or down)
        return max(0.5, min(1.5, factor))

    except Exception as e:
        print(f"Error in get_adjustment_factor: {e}")
        return 1.0 # Default to no adjustment on error


# --- 5. MODIFIED BATCH API Endpoint ---
@app.route('/api/recommend_batch', methods=['POST'])
def recommend_batch():
    """
    Processes an entire batch of inventory items in a single request.
    """
    if not model:
        return jsonify({"error": "Model is not loaded"}), 500
        
    try:
        data = request.json
        items_list = data['inventory_items']
        
        # --- 1. Batch Preprocessing ---
        X_seq_num_batch = []
        X_seq_cat_batch = []
        
        for item in items_list:
            history_data = item['historicalData']
            category_id = int(item['categoryId'])
            
            if len(history_data) != LOOK_BACK:
                return jsonify({"error": f"Invalid history length for {item.get('itemId')}"}), 400

            X_seq_num, X_cat = preprocess_input(history_data, category_id)
            X_seq_num_batch.append(X_seq_num)
            X_seq_cat_batch.append(X_cat)

        X_seq_num_batch = np.array(X_seq_num_batch)
        X_seq_cat_batch = np.array(X_seq_cat_batch)
        
        # --- 2. Make ONE Prediction ---
        inputs = {'num_input': X_seq_num_batch, 'cat_input': X_seq_cat_batch}
        y_pred_scaled_batch = model.predict(inputs)
        y_pred_unscaled_batch = scaler_y.inverse_transform(y_pred_scaled_batch)

        # --- 3. Get AI Agent Recommendations for Batch ---
        recommendations = []
        for i, item in enumerate(items_list):
            # Get the "base" prediction from the AI
            base_predicted_demand = float(y_pred_unscaled_batch[i][0])
            
            # --- THIS IS THE NEW LOGIC ---
            # Calculate the adjustment factor based on the item's own history
            adjustment_factor = get_adjustment_factor(item['historicalData'])
            
            # Apply the adjustment
            adjusted_demand = base_predicted_demand * adjustment_factor
            # --- END OF NEW LOGIC ---
            
            current_stock = float(item['currentStock'])
            lead_time = 7 
            
            # Use the *adjusted* demand for the final recommendation
            result = get_restock_recommendation(
                predicted_demand_7d=adjusted_demand, 
                current_stock=current_stock,
                lead_time_days=lead_time
            )
            
            result['itemId'] = item['itemId']
            recommendations.append(result)
            
        return jsonify(recommendations)

    except Exception as e:
        print(f"Error during batch prediction: {e}")
        return jsonify({"error": str(e)}), 500

# --- 6. Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)