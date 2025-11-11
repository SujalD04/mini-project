// --- GLOBAL WAREHOUSE NETWORK ---
// --- FIXED: IDs now match your backend's warehouse.csv data (e.g., "W001", "W005") ---
export const warehouses = [
  // India (Mapped to W001-W006 from your training data)
  { id: 'W001', name: 'Delhi Warehouse', city: 'Delhi, India', pos: [28.7041, 77.1025] },
  { id: 'W002', name: 'Mumbai Hub', city: 'Mumbai, India', pos: [19.0760, 72.8777] },
  { id: 'W003', name: 'Chennai Port', city: 'Chennai, India', pos: [13.0827, 80.2707] },
  { id: 'W004', name: 'Kolkata Depot', city: 'Kolkata, India', pos: [22.5726, 88.3639] },
  { id: 'W005', name: 'Bangalore Tech Center', city: 'Bangalore, India', pos: [12.9716, 77.5946] },
  { id: 'W006', name: 'Dubai Logistics City', city: 'Dubai, UAE', pos: [25.2048, 55.2708] }, // Assuming W006 is Dubai

  // --- Other global warehouses (Add IDs as needed) ---
  { id: 'wh-na-001', name: 'Los Angeles Hub', city: 'Los Angeles, USA', pos: [34.0522, -118.2437] },
  { id: 'wh-eu-003', name: 'London Gateway', city: 'London, UK', pos: [51.5074, -0.1278] },
  { id: 'wh-as-001', name: 'Shanghai Port', city: 'Shanghai, China', pos: [31.2304, 121.4737] },
  { id: 'wh-au-001', name: 'Sydney Port', city: 'Sydney, Australia', pos: [-33.8688, 151.2093] },
];


// --- GLOBAL DEMAND SIGNALS ---
// --- FIXED: IDs now match your backend's store_id data (e.g., "S001", "S003") ---
export const demandSignals = [
  // --- Stores (from your CSVs, e.g., S001-S010) ---
  { 
    id: 'S001', 
    name: 'Hyderabad Store', 
    city: 'Hyderabad, India', 
    pos: [17.3850, 78.4867], 
    priority: 3 // Low priority (standard restock)
  },
  { 
    id: 'S002', 
    name: 'New York Store', 
    city: 'New York, USA', 
    pos: [40.7128, -74.0060], 
    priority: 3 
  },
  { 
    id: 'S003', 
    name: 'London Store', 
    city: 'London, UK', 
    pos: [51.5074, -0.1278], 
    priority: 2 // Medium priority (seasonal spike)
  },
  {
    id: 'S009', // From your training data log
    name: 'Tokyo Store',
    city: 'Tokyo, Japan',
    pos: [35.6895, 139.6917],
    priority: 2
  },
  // --- Disasters/Events (new) ---
  { 
    id: 'dz-002', 
    name: 'Flood Relief - Jakarta', 
    city: 'Jakarta, Indonesia', 
    pos: [-6.2088, 106.8456], 
    priority: 1 // High priority
  },
];

// --- STORE LOCATIONS MAPPING ---
// This maps your store_id from the backend to a physical location.
// We'll build this automatically from the demandSignals list
export const storeLocations = {};
demandSignals.forEach(signal => {
  // We only add stores (SXXX) to this list
  if (signal.id.startsWith('S')) {
    storeLocations[signal.id] = {
      id: signal.id,
      name: signal.name,
      city: signal.city,
      pos: signal.pos
    };
  }
});

// --- Fallback ---
// This will add 'S001' just in case it wasn't in the list above
if (!storeLocations['S001']) {
  storeLocations['S001'] = { 
    id: 'store-S001', 
    name: 'Hyderabad Retail Store', 
    city: 'Hyderabad, India', 
    pos: [17.3850, 78.4867] 
  };
}