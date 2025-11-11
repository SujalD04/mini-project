import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. Import Geolib
import { getDistance } from 'geolib';

// Import our components and data
import { warehouses, demandSignals } from '../utils/warehouseData.js';
import AutocompleteSearch from '../components/AutocompleteSearch.jsx';

// --- Icon Fix (Keep this) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- End of fix ---

// Helper function for marker colors
const getPriorityOptions = (priority) => {
  switch (priority) {
    case 1: return { color: '#ef4444', fillColor: '#fca5a5' }; // Red
    case 2: return { color: '#f59e0b', fillColor: '#fde68a' }; // Yellow
    case 3: return { color: '#22c55e', fillColor: '#bbf7d0' }; // Green
    default: return { color: '#818cf8', fillColor: '#c7d2fe' }; // Indigo (Warehouse)
  }
};

// --- 2. New Polyline style ---
const routeLineOptions = { color: '#4f46e5', weight: 4, opacity: 0.7, dashArray: '5, 10' };


const LogisticsPage = () => {
  // Global map center
  const mapCenter = [20, 0];
  const mapZoom = 2;

  // 3. State now holds the full location object
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);

  // 4. Calculate distance and route line when start/end changes
  const { routeLine, distanceKm } = useMemo(() => {
    if (!startLoc || !endLoc) {
      return { routeLine: [], distanceKm: 0 };
    }

    // Create the line for the map
    const line = [startLoc.pos, endLoc.pos];

    // Calculate distance
    const distanceMeters = getDistance(
      { latitude: startLoc.pos[0], longitude: startLoc.pos[1] },
      { latitude: endLoc.pos[0], longitude: endLoc.pos[1] }
    );
    
    const distanceKm = (distanceMeters / 1000).toFixed(0);
    return { routeLine: line, distanceKm };

  }, [startLoc, endLoc]);


  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Global Logistics & Distribution
        </h2>

        {/* --- 5. Updated Search & Results Area --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-4 bg-gray-50 rounded-lg items-center">
          <AutocompleteSearch 
            items={warehouses}
            onSelect={(item) => setStartLoc(item)}
            placeholder="Start (Warehouse)"
          />
          <AutocompleteSearch 
            items={demandSignals}
            onSelect={(item) => setEndLoc(item)}
            placeholder="Destination (Demand Signal)"
          />
          {/* New Results Box */}
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <h4 className="text-sm font-medium text-gray-500">Route Details</h4>
            {distanceKm > 0 ? (
              <>
                <p className="text-2xl font-bold text-indigo-600">
                  {Number(distanceKm).toLocaleString('en-IN')} km
                </p>
                <p className="text-xs text-gray-500">
                  From: {startLoc.city}
                  <br/>
                  To: {endLoc.city}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm pt-2">Please select a start and end point.</p>
            )}
          </div>
        </div>
        
        {/* Map container */}
        <div style={{ height: '600px', width: '100%' }} className="rounded-lg overflow-hidden">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
          >
            {/* --- 6. Reverted to a light theme (CartoDB Positron) --- */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            {/* Render Warehouse Nodes */}
            {warehouses.map(wh => (
              <CircleMarker
                key={wh.id}
                center={wh.pos}
                radius={8}
                pathOptions={getPriorityOptions(null)}
              >
                <Popup><strong>{wh.name}</strong><br/>{wh.city}</Popup>
              </CircleMarker>
            ))}

            {/* Render Demand Nodes */}
            {demandSignals.map(zone => (
              <CircleMarker
                key={zone.id}
                center={zone.pos}
                radius={8}
                pathOptions={getPriorityOptions(zone.priority)}
              >
                <Popup>
                  <strong style={{color: getPriorityOptions(zone.priority).color}}>
                    {zone.priority === 1 ? 'URGENT: ' : ''}{zone.name}
                  </strong>
                  <br/>{zone.city}
                </Popup>
              </CircleMarker>
            ))}

            {/* --- 7. Replaced RoutingMachine with Polyline --- */}
            {routeLine.length > 0 && (
              <Polyline pathOptions={routeLineOptions} positions={routeLine} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPage;