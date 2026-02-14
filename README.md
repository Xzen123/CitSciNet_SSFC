# CitSciNet - Community Science Data Hub

## Project Structure

- **backend/**: Node.js/Express API with PostgreSQL/PostGIS
- **frontend/**: React application with Leaflet maps

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v13+) with PostGIS extension enabled
- Cloudinary account (for image uploads)

## Setup Instructions

### 1. Database Setup

Ensure you have PostgreSQL running and create a database named `citscinet`.
Enable PostGIS:
```sql
CREATE EXTENSION postgis;
```
Run the schema script located at `backend/models/schema.sql` to create the tables.

### 2. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file based on the provided template and fill in your credentials:
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/citscinet
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```
Start the application:
```bash
npm start
```

## Features Implemented

- **Map View**: Interactive map with clustering using Leaflet.
- **Observation Form**: Submit observations with GPS location.
- **Offline Support**: Service worker caches resources; offline observations saved locally (basic implementation).
- **Backend API**: Endpoints for observations, projects, and authentication.

## Next Steps

- Implement user authentication flows on frontend.
- connect frontend to real backend API (currently points to localhost:5000).
- Enhance offline sync logic using IndexedDB.
