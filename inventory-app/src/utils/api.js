// API server is running on port 8000
const API_URL = 'http://127.0.0.1:8000';

/**
 * Fetches the full decision-optimized recommendation for a SINGLE item.
 */
export const fetchDecisionForItem = async (sku, storeId = 'S001') => {
  const response = await fetch(
    `${API_URL}/predict?sku=${sku}&store_id=${storeId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get decision from AI');
  }
  return response.json();
};

/**
 * NEW: Fetches the list of inventory items from the backend.
 */
export const fetchInventory = async () => {
  const response = await fetch(`${API_URL}/inventory`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch inventory');
  }
  return response.json();
};