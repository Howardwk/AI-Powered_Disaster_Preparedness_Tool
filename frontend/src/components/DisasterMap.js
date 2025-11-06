import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, Paper } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different risk levels
const createRiskIcon = (riskLevel) => {
  const colors = {
    low: '#4caf50',
    moderate: '#ff9800',
    high: '#f44336',
    critical: '#d32f2f',
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[riskLevel] || '#757575'};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">⚠</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to update map view when location changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
    }
  }, [center, zoom, map]);
  
  return null;
}

const DisasterMap = ({ 
  predictions, 
  locations = [], 
  showRiskZones = true,
  showHeatMap = false,
  showEvacuationRoutes = false 
}) => {
  const mapRef = useRef(null);

  // Default center (Nairobi)
  const defaultCenter = predictions?.coordinates 
    ? [predictions.coordinates.lat, predictions.coordinates.lon]
    : [-1.2921, 36.8219];

  // Get risk level color
  const getRiskColor = (riskLevel) => {
    const colors = {
      low: '#4caf50',
      moderate: '#ff9800',
      high: '#f44336',
      critical: '#d32f2f',
    };
    return colors[riskLevel] || '#757575';
  };

  // Generate risk zones (circles around locations)
  const riskZones = locations.length > 0 
    ? locations.map(loc => ({
        center: [loc.lat, loc.lon],
        radius: loc.riskLevel === 'critical' ? 50000 : 
                loc.riskLevel === 'high' ? 30000 :
                loc.riskLevel === 'moderate' ? 20000 : 10000,
        color: getRiskColor(loc.riskLevel),
        riskLevel: loc.riskLevel
      }))
    : predictions 
      ? [{
          center: [predictions.coordinates.lat, predictions.coordinates.lon],
          radius: predictions.riskLevel === 'critical' ? 50000 : 
                  predictions.riskLevel === 'high' ? 30000 :
                  predictions.riskLevel === 'moderate' ? 20000 : 10000,
          color: getRiskColor(predictions.riskLevel),
          riskLevel: predictions.riskLevel
        }]
      : [];

  // Generate evacuation routes (simplified - straight lines to nearest safe point)
  const evacuationRoutes = showEvacuationRoutes && predictions
    ? [[
        [predictions.coordinates.lat, predictions.coordinates.lon],
        [predictions.coordinates.lat + 0.5, predictions.coordinates.lon + 0.5] // Example route
      ]]
    : [];

  return (
    <Box sx={{ height: '600px', width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={defaultCenter} zoom={10} />

        {/* Risk Zones (Circles) */}
        {showRiskZones && riskZones.map((zone, index) => (
          <Circle
            key={index}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <Typography variant="subtitle2">
                Risk Zone: {zone.riskLevel.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                Radius: {(zone.radius / 1000).toFixed(1)} km
              </Typography>
            </Popup>
          </Circle>
        ))}

        {/* Main Location Marker */}
        {predictions && (
          <Marker
            position={[predictions.coordinates.lat, predictions.coordinates.lon]}
            icon={createRiskIcon(predictions.riskLevel)}
          >
            <Popup>
              <Paper sx={{ p: 1, minWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  {predictions.location}
                </Typography>
                <Chip
                  label={predictions.riskLevel.toUpperCase()}
                  color={predictions.riskLevel === 'critical' || predictions.riskLevel === 'high' ? 'error' : 
                         predictions.riskLevel === 'moderate' ? 'warning' : 'success'}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Coordinates: {predictions.coordinates.lat.toFixed(4)}, {predictions.coordinates.lon.toFixed(4)}
                </Typography>
                {predictions.predictions && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block">
                      Top Risks:
                    </Typography>
                    {Object.entries(predictions.predictions)
                      .filter(([_, pred]) => pred.riskLevel === 'high' || pred.riskLevel === 'critical')
                      .slice(0, 3)
                      .map(([type, pred]) => (
                        <Chip
                          key={type}
                          label={`${type}: ${pred.riskLevel}`}
                          size="small"
                          sx={{ mr: 0.5, mt: 0.5 }}
                        />
                      ))}
                  </Box>
                )}
              </Paper>
            </Popup>
          </Marker>
        )}

        {/* Additional Location Markers */}
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.lon]}
            icon={createRiskIcon(loc.riskLevel)}
          >
            <Popup>
              <Typography variant="subtitle2">{loc.name || 'Location'}</Typography>
              <Chip label={loc.riskLevel} size="small" />
            </Popup>
          </Marker>
        ))}

        {/* Evacuation Routes */}
        {showEvacuationRoutes && evacuationRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            pathOptions={{
              color: '#ff0000',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10'
            }}
          >
            <Popup>
              <Typography variant="body2">Evacuation Route</Typography>
            </Popup>
          </Polyline>
        ))}

        {/* Heat Map Layer (simplified using circles) */}
        {showHeatMap && riskZones.map((zone, index) => (
          <Circle
            key={`heat-${index}`}
            center={zone.center}
            radius={zone.radius * 1.5}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.1,
              weight: 0
            }}
          />
        ))}
      </MapContainer>
    </Box>
  );
};

export default DisasterMap;

