// This is the API endpoint of your running Flask server
const API_URL = 'http://127.0.0.1:5000/api/recommend_batch';

/**
 * Fetches AI-powered recommendations for the *entire* inventory at once.
 *
 * @param {Array<object>} inventory - The entire inventory array from your state.
 * @returns {Promise<Array<object>>} - A promise that resolves to the list of recommendations.
 */
export const fetchBatchRecommendations = async (inventory) => {

    // 1. Construct the payload in the *exact* format your new API expects.
    // A single object with one key: "inventory_items"
    const payload = {
        inventory_items: inventory
    };

    // 2. Make the ONE POST request to your Flask server
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    // 3. Handle the response
    if (!response.ok) {
        // If the server returns an error (e.g., 500), throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recommendations');
    }

    // 4. Return the successful JSON data (which is now a list of recommendations)
    return response.json();
};