// --- GLOBAL WAREHOUSE NETWORK ---
export const warehouses = [
  // North America
  { id: 'wh-na-001', name: 'Los Angeles Hub', city: 'Los Angeles, USA', pos: [34.0522, -118.2437] },
  { id: 'wh-na-002', name: 'Chicago Logistics', city: 'Chicago, USA', pos: [41.8781, -87.6298] },
  { id: 'wh-na-003', name: 'New York Seaport', city: 'New York, USA', pos: [40.7128, -74.0060] },
  { id: 'wh-na-004', name: 'Mexico City Center', city: 'Mexico City, MX', pos: [19.4326, -99.1332] },

  // South America
  { id: 'wh-sa-001', name: 'São Paulo Depot', city: 'São Paulo, Brazil', pos: [-23.5505, -46.6333] },

  // Europe
  { id: 'wh-eu-001', name: 'Port of Rotterdam', city: 'Rotterdam, NL', pos: [51.9244, 4.4777] },
  { id: 'wh-eu-002', name: 'Hamburg Hub', city: 'Hamburg, DE', pos: [53.5511, 9.9937] },
  { id: 'wh-eu-003', name: 'London Gateway', city: 'London, UK', pos: [51.5074, -0.1278] },
  { id: 'wh-eu-004', name: 'Paris Distribution', city: 'Paris, FR', pos: [48.8566, 2.3522] },

  // Asia (including India)
  { id: 'wh-in-001', name: 'Delhi Warehouse', city: 'Delhi, India', pos: [28.7041, 77.1025] },
  { id: 'wh-in-002', name: 'Mumbai Hub', city: 'Mumbai, India', pos: [19.0760, 72.8777] },
  { id: 'wh-in-003', name: 'Chennai Port', city: 'Chennai, India', pos: [13.0827, 80.2707] },
  { id: 'wh-in-004', name: 'Kolkata Depot', city: 'Kolkata, India', pos: [22.5726, 88.3639] },
  { id: 'wh-in-005', name: 'Bangalore Tech Center', city: 'Bangalore, India', pos: [12.9716, 77.5946] },
  { id: 'wh-as-001', name: 'Shanghai Port', city: 'Shanghai, China', pos: [31.2304, 121.4737] },
  { id: 'wh-as-002', name: 'Singapore Hub', city: 'Singapore, SG', pos: [1.3521, 103.8198] },
  { id: 'wh-as-003', name: 'Tokyo Distribution', city: 'Tokyo, Japan', pos: [35.6895, 139.6917] },
  { id: 'wh-me-001', name: 'Dubai Logistics City', city: 'Dubai, UAE', pos: [25.2048, 55.2708] },

  // Africa & Australia
  { id: 'wh-af-001', name: 'Johannesburg Hub', city: 'Johannesburg, ZA', pos: [-26.2041, 28.0473] },
  { id: 'wh-au-001', name: 'Sydney Port', city: 'Sydney, Australia', pos: [-33.8688, 151.2093] },
];


// --- GLOBAL DEMAND SIGNALS (replaces disasterZones) ---
// Priorities: 1-High (Red), 2-Medium (Yellow), 3-Low (Green)
export const demandSignals = [
  // --- High Priority (Disasters / Critical Shortages) ---
  { 
    id: 'ds-hi-001', 
    name: 'Critical Shortage - Hyderabad', 
    city: 'Hyderabad, India', 
    pos: [17.3850, 78.4867], 
    priority: 1 
  },
  { 
    id: 'ds-hi-002', 
    name: 'Flood Relief - Jakarta', 
    city: 'Jakarta, Indonesia', 
    pos: [-6.2088, 106.8456], 
    priority: 1 
  },

  // --- Medium Priority (Seasonal / High Demand) ---
  { 
    id: 'ds-med-001', 
    name: 'Seasonal Spike - London', 
    city: 'London, UK', 
    pos: [51.5074, -0.1278], 
    priority: 2 
  },
  { 
    id: 'ds-med-002', 
    name: 'New Product Launch - Tokyo', 
    city: 'Tokyo, Japan', 
    pos: [35.6895, 139.6917], 
    priority: 2 
  },
  { 
    id: 'ds-med-003', 
    name: 'Event Restock - Los Angeles', 
    city: 'Los Angeles, USA', 
    pos: [34.0522, -118.2437], 
    priority: 2 
  },

  // --- Low Priority (Standard Restocks) ---
  { 
    id: 'ds-low-001', 
    name: 'Standard Restock - New York', 
    city: 'New York, USA', 
    pos: [40.7128, -74.0060], 
    priority: 3 
  },
  { 
    id: 'ds-low-002', 
    name: 'Standard Restock - Sydney', 
    city: 'Sydney, Australia', 
    pos: [-33.8688, 151.2093], 
    priority: 3 
  },
  { 
    id: 'ds-low-003', 
    name: 'Standard Restock - São Paulo', 
    city: 'São Paulo, Brazil', 
    pos: [-23.5505, -46.6333], 
    priority: 3 
  },
];