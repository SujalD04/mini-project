from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import utils  # Your existing utils.py
import pandas as pd
from typing import List

app = FastAPI(
    title="Inventory Decision AI API",
    description="An API to run a decision-focused model for inventory optimization.",
    version="1.0.0"
)

# --- 1. Configure CORS ---
app.add_middleware(
    CORSMiddleware,
    # Allow your React app's origin
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Define API Response Models ---
class DecisionResponse(BaseModel):
    sku: str
    forecast: float
    order_quantity: float
    recommended_warehouse: str
    transport: str
    total_cost: float
    unit_cost: float

# We need a model for the inventory items
class InventoryItem(BaseModel):
    # Adjust these fields to match your CSV columns
    sku: str
    store_id: str
    quantity_units: int
    # Add other fields you want to display, e.g., 'category'
    # For now, we'll keep it simple.

# --- 3. The "/predict" endpoint (from before) ---
@app.get("/predict", response_model=DecisionResponse)
def predict_order(
    sku: str = Query(..., description="The SKU ID to analyze (e.g., 'SKU001')"),
    store_id: str = Query(..., description="The Store ID (e.g., 'S001')")
):
    try:
        decision = utils.run_decision_pipeline(sku=sku, store_id=store_id)
        if "error" in decision:
            raise HTTPException(status_code=500, detail=decision["error"])
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# --- 4. NEW: Endpoint to get inventory ---
@app.get("/inventory", response_model=List[InventoryItem])
def get_inventory():
    """
    Loads and returns the inventory data for the frontend.
    """
    try:
        # We load the *forecast* data, as that's what has the SKU history
        df = utils.df_forecast_data 
        
        # We need to get the *latest* entry for each SKU to show current stock
        # For the demo, we'll just get a unique list of SKUs and mock the rest.
        # A real app would query a database.
        
        # Let's just use the 'shipments.csv' to get a simple list
        df_items = pd.read_csv(utils.os.path.join(utils.DATA_DIR, "shipments.csv"))
        
        # Get unique SKUs and their latest quantity
        df_simple = df_items.drop_duplicates(subset=['sku'], keep='last')
        
        # Rename columns to match our Pydantic model
        df_simple = df_simple.rename(columns={"quantity_units": "quantity_units", "store_id": "store_id"})
        
        # Add any missing required fields with defaults
        if 'store_id' not in df_simple.columns:
            df_simple['store_id'] = 'S001' # Mock store_id if not present
        if 'quantity_units' not in df_simple.columns:
             df_simple['quantity_units'] = 100 # Mock quantity
        
        items = df_simple.to_dict(orient='records')
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load inventory: {str(e)}")

# --- 5. Root endpoint (unchanged) ---
@app.get("/")
def read_root():
    return {"status": "AI Decision Server is running."}

# --- 6. Run command (unchanged) ---
if __name__ == "__main__":
    print("Starting FastAPI server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)