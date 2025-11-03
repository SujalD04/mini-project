// --- DATA AND LOGIC UTILITIES ---

export const INR_CONVERSION_FACTOR = 83;
export const SAFETY_STOCK = 75; // Units (Based on previous RMSE analysis)
export const MIN_ORDER_QTY = 50; // Units (Case Size)

// --- FIX 1: Reduced to the 5 categories your model was trained on ---
const CATEGORIES = ['Clothing', 'Electronics', 'Furniture', 'Groceries', 'Toys'];

const ITEM_NAMES_BY_CATEGORY = {
    'Electronics': [
        'Monitor 27"', 'Wireless Keyboard', 'Noise-Cancelling Headphones', 'External SSD 1TB', 
        'Smart Home Hub', 'Portable Speaker', 'Ergonomic Mouse', 'Gaming Laptop', 
        'Power Bank', '4K Streaming Stick'
    ],
    'Groceries': [
        'Organic Coffee Beans', 'Almond Milk', 'Whole Wheat Bread', 'Avocados (Case)', 
        'Artisan Cheese', 'Free-Range Eggs', 'Oatmeal', 'Basmati Rice', 'Frozen Pizza', 
        'Sparkling Water'
    ],
    'Clothing': [
        'Slim Fit Denim Jeans', 'Classic White T-Shirt', 'Wool Sweater', 'Running Shoes', 
        'Rain Jacket', 'Black Dress Socks', 'Casual Sneakers', 'Graphic Hoodie', 
        'Yoga Leggings', 'Baseball Cap'
    ],
    'Furniture': [
        'Modular Corner Desk', 'Executive Office Chair', 'Mid-Century Sideboard', 
        'Queen Bed Frame', '4-Shelf Bookshelf', 'Sectional Sofa', 'Accent Lamp', 
        'Dining Table (Oak)', 'Bar Stools', 'Memory Foam Mattress'
    ],
    'Toys': [
        'Lego City Fire Truck', 'Action Figure', 'Remote Control Drone', 'Board Game: Catan', 
        'Puzzle Set', 'Barbie Dreamhouse', 'Wooden Blocks', 'Model Car Kit', 
        'Art Supplies Box', 'Fidget Spinner'
    ]
    // Removed 'Tools', 'Books', 'Cosmetics'
};

// --- FIX 1 (Continued): Updated the ID map ---
const CATEGORY_TO_ID = { 
    'Electronics': 1, 
    'Groceries': 3, 
    'Clothing': 0, 
    'Furniture': 2, 
    'Toys': 4 
};


/**
 * NEW HELPER FUNCTION
 * Generates the 45-day structured history your API needs.
 */
const generateMockHistoricalData = () => {
    const data = [];
    const regions = ['North', 'South', 'East', 'West'];
    const weathers = ['Sunny', 'Rainy', 'Cloudy'];
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

    // --- Create Realistic Patterns ---
    // 1. Base Trend: Give each item a slightly different starting point and trend
    const baseSales = Math.random() * 30 + 20; // Start between 20-50
    const trend = (Math.random() - 0.5) * 0.5; // Small daily trend (up or down)

    // 2. Weekly Seasonality: Create a 7-day pattern (e.g., spikes on day 5 & 6)
    const weeklyPattern = [0.8, 0.9, 0.85, 1.0, 1.2, 1.3, 0.9];

    for (let i = 0; i < 45; i++) {
        // --- Calculate Patterned Sales ---
        // 3. Noise: Add a small random amount
        const noise = (Math.random() - 0.5) * 5;
        
        // Combine base, trend, seasonality, and noise
        let sales = (baseSales + (i * trend)) * weeklyPattern[i % 7] + noise;
        // Ensure sales are never negative
        sales = Math.max(10, sales); 

        // Lagged features will be based on this patterned 'sales'
        const lag1 = data[i - 1] ? data[i - 1]["Lag_Sales_D-1"] : sales;
        const lag2 = data[i - 2] ? data[i - 2]["Lag_Sales_D-1"] : sales;
        const lag7 = data[i - 7] ? data[i - 7]["Lag_Sales_D-1"] : sales;

        data.push({
            // Lagged/Rolling features (now based on the pattern)
            "Lag_Sales_D-1": Math.floor(lag1),
            "Lag_Sales_D-2": Math.floor(lag2),
            "Lag_Sales_D-7": Math.floor(lag7),
            "Lag_Inventory_D-1": Math.floor(Math.random() * 200) + 50,
            "Rolling_Mean_7D": Math.floor((lag1 + lag2 + lag7) / 3), // Simple rolling mean mock
            
            // Exogenous features (these can stay random)
            "Price": Math.floor(Math.random() * 100) + 20,
            "Discount": Math.random() > 0.7 ? 0.1 : 0.0,
            "Holiday/Promotion": Math.random() > 0.9 ? 1 : 0,
            "Competitor Pricing": Math.floor(Math.random() * 100) + 20,

            // Raw categorical features (Flask will one-hot encode these)
            "Region": regions[i % regions.length],
            "Weather Condition": weathers[i % weathers.length],
            "Seasonality": seasons[i % seasons.length]
        });
    }
    return data;
};


export const generateMockInventory = () => {
    let inventory = [];
    let itemIdCounter = 1000;
    
    CATEGORIES.forEach(category => {
        const categoryItemNames = ITEM_NAMES_BY_CATEGORY[category] || ['Default Item'];
        
        for (let i = 0; i < 10; i++) {
            const itemName = categoryItemNames[i] || `Default ${i}`;
            const itemId = `P${itemIdCounter++}`;
            const basePrice = (Math.random() * 100 + 10); 
            const priceINR = parseFloat((basePrice * INR_CONVERSION_FACTOR).toFixed(0));
            const stockLevel = Math.floor(Math.random() * 450) + 50; 
            const reorderPoint = Math.floor(stockLevel * 0.3) + 20; 
            
            inventory.push({
                itemId,
                name: `${itemName} (${itemId.slice(-3)})`, 
                category: category,
                categoryId: CATEGORY_TO_ID[category],
                currentStock: stockLevel,
                price: priceINR, 
                reorderPoint: reorderPoint,
                storeId: 'S001',
                historicalData: generateMockHistoricalData()
            });
        }
    });
    return inventory;
};


// --- MOCK PREDICTION AND POLICY (REMOVED) ---
// Your Python API now handles all this logic.


export const formatINR = (amount) => {
    if (typeof amount !== 'number') return '₹0';
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};