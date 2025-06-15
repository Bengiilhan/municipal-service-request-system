# 🏛️ Municipal Service Request System

This web application allows citizens to report local municipal issues (e.g., potholes, broken streetlights, garbage problems) through an online platform. The system improves transparency and enables faster municipal response. It was designed for İzmir Municipality but can be adapted to other regions.

## Features

### Citizen Panel
- Register and login (JWT authentication)
- Submit complaints with title, description, image, video, and location
- Auto-fill address using reverse geocoding (via Nominatim API)
- View submitted complaints and their statuses (color-coded)
- View other citizens’ complaints and see their locations on a map

### Admin Dashboard
- Admin login and access to management panel
- See all complaints listed and on an interactive map
- Filter/search complaints by keyword
- Update complaint status: “Pending”, “In Progress”, “Resolved”
- Soft delete support (complaints aren't permanently removed)
- View complaint details including media, location, and user

## Map Integration
- Built using Leaflet.js and OpenStreetMap
- Location selected via map click
- Markers show complaint positions
- Marker colors change based on complaint status

## Tech Stack
- **Backend:** Django + Django REST Framework
- **Frontend:** React.js
- **Database:** PostgreSQL
- **Authentication:** JWT (SimpleJWT)
- **Map Integration:** Leaflet.js + Nominatim API (for reverse geocoding)
- **Media Handling:** Image and Video upload (stored via Django MEDIA_ROOT)

## How to Run the Project

### Backend (Django)
```bash
cd municipal_project
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## Project Structure
```
municipal_project/
│
├── api/                   # Django API app (models, serializers, views)
├── municipal_project/     # Django configuration and settings
├── frontend/              # React frontend (components, pages)
├── media/                 # Uploaded images and videos
├── .env                   # Environment variables (not versioned)
├── requirements.txt       # Python dependencies
└── README.md              # Project documentation
```

## Security Notes
- Sensitive data like Django SECRET_KEY and DB credentials are stored in `.env`
- `.env` is excluded from Git tracking using `.gitignore`

## Testing
- Unit tests for React components using Jest and React Testing Library
- Tests for login, registration, and form submission with input validation
