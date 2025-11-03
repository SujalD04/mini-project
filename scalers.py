import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
import json

print("--- Starting Artifact Generation (NO TRAINING) ---")

# --- 1. Load Data ---
# Make sure this path is correct!
FILE_PATH = 'Combined_5_Categories_Processed_Data_V3.csv'

try:
    df = pd.read_csv(FILE_PATH)
    print(f"Successfully loaded '{FILE_PATH}'")
except FileNotFoundError:
    print(f"ERROR: Could not find '{FILE_PATH}'")
    print("Please upload your dataset and update the FILE_PATH variable.")
    # Stop execution if file not found
    raise

df.sort_values(['Product ID', 'Date'], inplace=True)

# --- 2. Re-create Features (must be IDENTICAL to training script) ---
# These are the *original* categorical columns before one-hot encoding
original_categorical_features = ['Region', 'Weather Condition', 'Seasonality']
df = pd.get_dummies(df, columns=original_categorical_features, drop_first=True)
print("Applied one-hot encoding.")

# This list *must* include the one-hot-encoded columns
numerical_feature_cols = [
    'Lag_Sales_D-1', 'Lag_Sales_D-2', 'Lag_Sales_D-7', 'Lag_Inventory_D-1', 'Rolling_Mean_7D',
    'Price', 'Discount', 'Holiday/Promotion', 'Competitor Pricing',
] + [col for col in df.columns if col.startswith(('Region_', 'Weather Condition_', 'Seasonality_'))]

category_col = 'Category_ID'
target_col = 'Target_Sales_D+7'

X_num = df[numerical_feature_cols].values
y = df[target_col].values

# --- 3. Create and FIT the Scalers ---
# This is the crucial step: "fitting" them to the original data's range
scaler_X = MinMaxScaler(feature_range=(0, 1))
scaler_X.fit(X_num) # Use fit() or fit_transform()
print("scaler_X has been fitted.")

scaler_y = MinMaxScaler(feature_range=(0, 1))
scaler_y.fit(y.reshape(-1, 1)) # Use fit() or fit_transform()
print("scaler_y has been fitted.")

# --- 4. Save Artifacts for API ---
print("--- Saving artifacts for API ---")

joblib.dump(scaler_X, 'scaler_X.joblib')
joblib.dump(scaler_y, 'scaler_y.joblib')

# Save all the column info the API will need
feature_cols = {
    'numerical': numerical_feature_cols, # The full list of final columns
    'categorical': original_categorical_features, # The *original* names
    'category_id_col': category_col
}

with open('model_features.json', 'w') as f:
    json.dump(feature_cols, f, indent=4)

print("\nArtifacts saved successfully:")
print("-> scaler_X.joblib")
print("-> scaler_y.joblib")
print("-> model_features.json")

print("\nYou can now download these 3 files and place them in your Flask backend folder.")