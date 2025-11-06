# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check
- **GET** `/api/health`
- Returns API status

**Response:**
```json
{
  "status": "OK",
  "message": "Disaster Preparedness API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get Disaster Predictions
- **GET** `/api/disasters/predict`
- Get predictions for all disaster types for a location

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `location` (optional): Location name

**Example:**
```
GET /api/disasters/predict?lat=40.7128&lon=-74.0060&location=New%20York
```

**Response:**
```json
{
  "success": true,
  "location": "New York",
  "predictions": {
    "location": "New York",
    "coordinates": { "lat": 40.7128, "lon": -74.0060 },
    "riskLevel": "moderate",
    "predictions": {
      "hurricane": {
        "type": "hurricane",
        "riskLevel": "low",
        "confidence": 30,
        "probability": 18,
        "factors": [],
        "recommendation": "Monitor weather updates...",
        "timeframe": "24-48 hours"
      }
    },
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Historical Disaster Data
- **GET** `/api/disasters/history`
- Get historical disaster events

**Query Parameters:**
- `lat` (optional): Latitude
- `lon` (optional): Longitude
- `type` (optional): Disaster type
- `limit` (optional): Number of results (default: 50)

**Example:**
```
GET /api/disasters/history?lat=40.7128&lon=-74.0060&limit=10
```

---

### Get Specific Disaster Type Prediction
- **GET** `/api/disasters/predict/:type`
- Get prediction for a specific disaster type

**URL Parameters:**
- `type`: Disaster type (hurricane, flood, tornado, earthquake, wildfire)

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude

**Example:**
```
GET /api/disasters/predict/hurricane?lat=25.7617&lon=-80.1918
```

---

### Generate Response Plan
- **POST** `/api/plans/generate`
- Generate a personalized disaster response plan

**Request Body:**
```json
{
  "location": "Miami, FL",
  "disasterType": "hurricane",
  "householdSize": 3,
  "specialNeeds": ["infants", "elderly"],
  "lat": 25.7617,
  "lon": -80.1918
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "id": "PLAN-1234567890-abc123",
    "location": "Miami, FL",
    "disasterType": "hurricane",
    "householdSize": 3,
    "sections": [
      {
        "title": "Pre-Disaster Preparation",
        "actions": [...],
        "checklist": [...]
      }
    ]
  }
}
```

---

### Get Alerts for Location
- **GET** `/api/alerts/:location`
- Get active alerts for a location

**URL Parameters:**
- `location`: Location name

**Query Parameters:**
- `lat` (optional): Latitude
- `lon` (optional): Longitude

**Example:**
```
GET /api/alerts/New%20York?lat=40.7128&lon=-74.0060
```

**Response:**
```json
{
  "success": true,
  "location": "New York",
  "alerts": [
    {
      "id": "ALERT-123",
      "type": "hurricane",
      "severity": "high",
      "message": "High risk of hurricane conditions...",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Get All Active Alerts
- **GET** `/api/alerts`
- Get all active alerts

**Response:**
```json
{
  "success": true,
  "alerts": [...],
  "count": 5
}
```

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Latitude and longitude are required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to get predictions",
  "message": "Error details..."
}
```

---

## WebSocket Events (Real-time)

Connect to: `ws://localhost:5000`

### Subscribe to Alerts
```javascript
socket.emit('subscribe-alerts', 'New York');
```

### Receive Alert Updates
The server will broadcast alerts to subscribed rooms.

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Recommended: 100 requests/minute per IP
- Implement using express-rate-limit

---

## Authentication

Currently no authentication is required. For production:
- Implement JWT authentication
- Add user management
- Secure API endpoints



