// --- DATA AND LOGIC UTILITIES ---

export const INR_CONVERSION_FACTOR = 83;
export const SAFETY_STOCK = 75; // Units (Based on previous RMSE analysis)
export const MIN_ORDER_QTY = 50; // Units (Case Size)

const CATEGORIES = ['Electronics', 'Groceries', 'Clothing', 'Furniture', 'Tools', 'Books', 'Toys', 'Cosmetics'];

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
    'Tools': [
        '20V Cordless Drill', 'Universal Socket Set', 'Digital Multimeter', 'Telescopic Ladder', 
        'Orbital Sander', 'Adjustable Wrench', 'Precision Screwdriver', 'Safety Goggles', 
        'Magnetic Stud Finder', 'Heavy Duty Utility Knife'
    ],
    'Books': [
        'Sci-Fi Novel: Martian', 'Atomic Habits', 'The Great Gatsby', 'Sapiens', 
        'Python Guide', 'Silent Patient', 'Cookbook: Italian', 'Kids Picture Book', 
        'Poetry Collection', 'Graphic Novel'
    ],
    'Toys': [
        'Lego City Fire Truck', 'Action Figure', 'Remote Control Drone', 'Board Game: Catan', 
        'Puzzle Set', 'Barbie Dreamhouse', 'Wooden Blocks', 'Model Car Kit', 
        'Art Supplies Box', 'Fidget Spinner'
    ],
    'Cosmetics': [
        'Hydrating Moisturizer', 'SPF 50 Sunscreen', 'Volumizing Mascara', 'Nail Polish Set', 
        'Hyaluronic Acid Serum', 'Charcoal Face Mask', 'Waterproof Eyeliner', 'Lip Gloss', 
        'Perfume (Ocean Mist)', 'Makeup Brush Set'
    ]
};
const CATEGORY_TO_ID = { 'Electronics': 1, 'Groceries': 3, 'Clothing': 0, 'Furniture': 2, 'Tools': 5, 'Books': 6, 'Toys': 4, 'Cosmetics': 7 };


export const generateMockInventory = () => {
    let inventory = [];
    let itemIdCounter = 1000;
    
    CATEGORIES.forEach(category => {
        const categoryItemNames = ITEM_NAMES_BY_CATEGORY[category];
        
        for (let i = 0; i < 10; i++) {
            const itemId = `P${itemIdCounter++}`;
            const basePrice = (Math.random() * 100 + 10); 
            const priceINR = parseFloat((basePrice * INR_CONVERSION_FACTOR).toFixed(0)); // Round to nearest Rupee

            const stockLevel = Math.floor(Math.random() * 450) + 50; 
            const reorderPoint = Math.floor(stockLevel * 0.3) + 20; 
            
            inventory.push({
                itemId,
                name: `${categoryItemNames[i]} (${itemId.slice(-3)})`, 
                category: category,
                categoryId: CATEGORY_TO_ID[category],
                currentStock: stockLevel,
                price: priceINR, 
                reorderPoint: reorderPoint,
                storeId: 'S001',
                historicalData: Array(45).fill(0).map(() => Math.floor(Math.random() * 100) + 1)
            });
        }
    });
    return inventory;
};

// --- MOCK PREDICTION AND POLICY ---

export const mockPredictDemand = (item, mockErrorFactor = 0.95) => {
    const historicalDemand = item.historicalData.slice(-7).reduce((a, b) => a + b, 0);
    const predictedSales = (historicalDemand * mockErrorFactor) + (Math.random() * 50);
    return Math.max(0, predictedSales);
};

export const calculateRestockOrder = (item, predictedDemand) => {
    const targetStock = predictedDemand + SAFETY_STOCK;
    const rawOrderQuantity = targetStock - item.currentStock;
    
    let orderQuantity = 0;

    if (rawOrderQuantity > MIN_ORDER_QTY) {
        orderQuantity = Math.ceil(rawOrderQuantity / MIN_ORDER_QTY) * MIN_ORDER_QTY;
    }

    const status = item.currentStock < item.reorderPoint ? 'Critical Low' : (rawOrderQuantity > 0 ? 'Review Needed' : 'In Stock');
    const badgeColor = item.currentStock < item.reorderPoint ? 'bg-red-100 text-red-800' : (rawOrderQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800');

    return {
        orderQuantity: orderQuantity,
        predictedDemand: predictedDemand,
        targetStock: targetStock,
        status: status,
        badgeColor: badgeColor,
        isCritical: item.currentStock < item.reorderPoint,
    };
};

export const formatINR = (amount) => {
    // Ensures a clean Indian Rupee format
    if (typeof amount !== 'number') return '₹0';
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};
