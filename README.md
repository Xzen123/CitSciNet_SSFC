# CitSci-Net 🌍
## Hackathon Project: Citizen Science Platform with AI-Powered Geofencing & Gamification

**CitSci-Net** is a fully functional citizen science platform that combines **automatic geofencing** with **gamification mechanics** to encourage community participation in scientific data collection. Built with React + Node.js, featuring real-time location validation, offline-first architecture, and community engagement features.

### 🏆 Hackathon Key Achievements
✅ **19 cities pre-configured with automatic OSM boundary detection**  
✅ **Real-time GPS geofencing with Haversine distance validation**  
✅ **Complete gamification system (points, badges, leaderboards) integrated**  
✅ **Offline-first mobile-ready architecture with IndexedDB sync**  
✅ **Production-ready APIs with JWT auth, image uploads, and QA pipeline**  
✅ **Live example projects: Patna (15km strict), Bihar (50km flexible)**

---

## ✨ Integrated Features (All Working)

### 🗺️ **Advanced Geofencing System**
- **Automatic City/Region Detection**: Automatically identifies city boundaries using OpenStreetMap data (no manual polygon definition needed)
- **Real-Time Boundary Validation**: GPS-based location verification with instant feedback to users
- **Radius-Based Project Zones**: Define observation areas with precise kilometer-based radius constraints
- **Strict Boundary Enforcement**: 
  - Client-side validation prevents wasted submissions
  - Server-side validation ensures data integrity
  - Haversine distance algorithm for accurate boundary calculations
- **Multi-Level Geofence Support**:
  - City-level geofencing (automatic OSM boundary detection)
  - Project-specific radius constraints (strict enforcement for sensitive projects)
  - User geofence check audit logs for transparency

**Example Projects:**
- 📍 **Patna Urban Air Quality (15km radius)** - Strict boundary enforcement, rejects submissions outside city limits
- 📍 **Bihar Environmental Monitoring (50km radius)** - State-level coverage with flexible boundaries
- 📍 **19 Global Cities** - Automatic boundary detection for New Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Patna, Bihar, London, New York, Tokyo, Sydney, Paris, Berlin, Toronto

---

### 🎮 **Gamification System**
- **Points Engine**: Award points for observations, quality contributions, and streak achievements
- **Badge System**: Unlock achievement badges based on:
  - Observation milestones (Early Bird, Prolific Observer, etc.)
  - Quality contributions (Data Validator, Quality Champion)
  - Streak achievements (Consecutive day submissions)
  - Regional expertise (Location-based badges)
- **Dynamic Leaderboards**:
  - Global rankings by points
  - Regional/project-specific leaderboards
  - Weekly and monthly competitive rankings
  - User tier progression system
- **Reward Tiers**: Bronze → Silver → Gold → Platinum progression
- **Customizable Gamification**: Configure point values, badges, and rewards per project

---

### 📱 **Observation Management**
- **Multi-Type Observation Capture**:
  - Text observations with rich descriptions
  - Photo uploads with metadata preservation
  - Audio/video integration support
  - Timestamp and GPS coordinate logging
- **Smart Form Validation**:
  - Real-time field validation
  - Automatic data sanitization
  - Type-specific input constraints
- **Batch Observation Import**: Upload multiple observations at once
- **Observation History**: Track all submissions with edit history and modification logs
- **Quality Scoring**: Automatic QA assessment with feedback recommendations

---

### 🎯 **Project Management**
- **Create & Customize Projects**:
  - Define project scope, objectives, and target areas
  - Configure geofencing boundaries and restrictions
  - Set data quality requirements
  - Customize gamification rules
- **Project Discovery**: Browse and explore active projects
- **Progress Tracking**: Real-time project statistics and completion metrics
- **Team Collaboration**: Invite researchers and citizen scientists to projects
- **Project-Specific Leaderboards**: Competitive engagement within projects

---

### 📊 **Data Quality & QA**
- **Automated Quality Scoring**:
  - Validates observation completeness
  - Assesses data accuracy and relevance
  - Flags potential anomalies
- **Quality Badge System**: Visual indicators for data quality levels
- **Expert Review Pipeline**: Researchers can validate and approve observations
- **Data Export**: Download verified observations in multiple formats
- **Quality Metrics Dashboard**: Monitor data quality trends

---

### 🗺️ **Interactive Map Interface**
- **Real-Time Observation Mapping**:
  - View observations on interactive map
  - Cluster markers for density visualization
  - Filter by project, date range, quality score
- **Geofence Boundary Visualization**: Display project areas and city boundaries
- **Mini Map Navigation**: Quick location preview in observation forms
- **Location Search**: Find observations by city or coordinates

---

### 🔐 **User Authentication & Profiles**
- **Secure Authentication**:
  - Email/password registration and login
  - JWT token-based session management
  - Password reset functionality
  - Profile verification system
- **User Profiles**:
  - Contribution statistics and badges
  - Leaderboard rankings
  - Observation history
  - Expertise areas and specializations
- **Role-Based Access Control**:
  - Citizen Scientists (data collection)
  - Researchers (data review and analysis)
  - Project Managers (administration)
  - Admins (system-wide management)

---

### 📡 **Offline-First Architecture**
- **Full Offline Support**:
  - Capture observations without internet connection
  - Store data locally in IndexedDB
  - Automatic sync when connectivity restored
- **Background Sync**: Data syncs seamlessly in the background
- **Conflict Resolution**: Smart merge strategies for simultaneous offline/online edits
- **Offline Indicators**: Clear UI feedback on sync status

---

### 🌙 **Premium UI/UX**
- **Dark Mode Support**:
  - System-wide dark theme with smooth transitions
  - Eye-friendly color palettes
  - Per-user theme preferences
- **3D Visual Components**:
  - Interactive 3D cards and carousels
  - Liquid Glass morphism design
  - Modern animations and micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

---

### 💾 **Data Management**
- **Secure Data Storage**:
  - PostgreSQL backend with encrypted sensitive fields
  - Cloud image storage (Cloudinary integration)
  - Automated database backups
- **Data Export**:
  - Export to CSV, JSON, GeoJSON formats
  - Customizable export filters
  - Batch export capabilities
- **Data Validation**:
  - Comprehensive input validation
  - Geospatial data accuracy checks
  - Duplicate detection and prevention

---

### 🔍 **Search & Discovery**
- **Advanced Search**:
  - Full-text observation search
  - Filter by location, date, type, quality
  - Saved search queries
- **Project Discovery**:
  - Search projects by name, topic, location
  - Featured project highlights
  - Trending projects and observations
- **Explore Dashboard**: Curated observations and project recommendations

---

### 📈 **Analytics & Reporting**
- **Statistical Dashboard**:
  - Observation count and trends
  - Data quality metrics
  - User engagement analytics
  - Geographic distribution maps
- **Custom Reports**:
  - Generate project-specific reports
  - Compare historical trends
  - Export analytics data
- **Real-Time Statistics**: Live counters for observations, users, and projects

---

### 🌐 **Geolocation Services**
- **GPS Integration**:
  - One-click location capture
  - GPS accuracy indicators
  - Manual location override capability
- **Reverse Geocoding**: Automatic city/address lookup
- **Boundary Detection**: Identify relevant project areas for current location
- **Location Validation**: Warn users when submitting from unexpected locations

---

### 📤 **Cloud Integration**
- **Cloudinary Image Hosting**:
  - Automatic image optimization
  - CDN delivery for fast loading
  - Responsive image sizing
  - Metadata preservation
- **API Integration**:
  - OpenStreetMap Nominatim (boundary data)
  - OpenCage Geocoding (location services)
  - Extensible third-party API support

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v14+
- PostgreSQL (local or remote)
- Basic terminal knowledge

### Setup

```bash
# 1. Clone and navigate
git clone https://github.com/yourusername/citsci-net.git && cd citsci-net

# 2. Backend (Port 5000)
cd backend
npm install
# Configure .env with DATABASE_URL and optional API keys
npm start

# 3. Frontend (Port 3000) - in new terminal
cd frontend
npm install
npm start
```

**Access at:** `http://localhost:3000`

**Demo Credentials:**
- Email: any email
- Auto-registers on first login
- Pre-configured projects ready to use

### What Works Out of the Box
✅ Create observations with auto-location detection  
✅ See real-time geofence boundary validation  
✅ Earn points and badges (gamification)  
✅ View observations on interactive map  
✅ Submit observations with photo uploads  
✅ Works offline (data syncs automatically)  

---

## 📊 Live Example Projects

### Project 1: Patna Urban Air Quality 📍
- **Center**: 25.5941°N, 85.1376°E  
- **Radius**: 15 km (STRICT enforcement)
- **Feature**: Demonstrates geofence rejection for submissions outside boundaries
- **What to note**: Try submitting from Delhi coordinates - will be rejected!

### Project 2: Bihar Environmental Monitoring 📍
- **Center**: 25.5961°N, 85.1376°E
- **Radius**: 50 km (flexible)
- **Feature**: State-level observations with gamification tracking

### Bonus: 19 Global Cities
New Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Patna, Bihar, London, New York, Tokyo, Sydney, Paris, Berlin, Toronto

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React.js with Hooks
- Mapbox GL for mapping
- Framer Motion for animations
- IndexedDB for offline storage
- TailwindCSS for styling

**Backend:**
- Node.js + Express.js
- PostgreSQL with PostGIS extension
- JWT token authentication
- Multer for file uploads
- Cloudinary API integration

**External APIs:**
- OpenStreetMap Nominatim (auto city boundary detection)
- Cloudinary (image hosting & CDN)
- OpenCage (reverse geocoding)

---

## 🎯 Key Technical Highlights

### Geofencing Engine ⭐
- **Automatic OSM Boundary Detection**: Fetches city polygons from OpenStreetMap
- **Haversine Distance Algorithm**: Accurate GPS distance calculation
- **Ray-Casting for Point-in-Polygon**: Determines if location is inside city boundaries
- **Real-Time Client-Side Validation**: Immediate feedback to users
- **Server-Side Enforcement**: Rejects submissions outside project boundaries

### Gamification System ⭐
- **Points System**: Configurable points per observation/badge
- **Badge Engine**: Achievement tracking with multiple tiers
- **Leaderboards**: Real-time global and project-specific rankings
- **User Tier Progression**: Bronze → Silver → Gold → Platinum

### Offline Architecture ⭐
- **IndexedDB Storage**: Stores observations locally
- **Automatic Sync**: Syncs when internet restored
- **Conflict Resolution**: Smart merge strategies
- **Service Worker**: Background sync capabilities

---

## 📁 Folder Structure

```
backend/
├── routes/            # API endpoints (auth, observations, projects, gamification)
├── services/          # Geofencing, QA, gamification business logic
├── models/            # Database schemas & migrations
└── config/            # Database, Cloudinary, environment setup

frontend/
├── components/        # UI components (forms, cards, maps)
├── pages/            # Route pages (NewObservation, Dashboard, etc)
├── hooks/            # useGeofencing, useGeolocation, useOfflineSync
└── services/         # API client, offline storage service
```

---

## ⚙️ Configuration

### Minimal Setup (.env)
```bash
# Backend - Required
DATABASE_URL=postgresql://user:password@localhost/citsci
JWT_SECRET=your_secret_key
NODE_ENV=development

# Optional (image uploads work without these)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
```

**Note:** All features work with basic setup. Cloudinary is optional; file uploads gracefully degrade without it.

---

## 🔌 API Endpoints

**Core Observations**
- `POST /api/observations` - Submit observation (with geofence validation)
- `GET /api/observations` - List with filters
- `GET /api/projects/:id/geofence` - Get project boundary info

**Gamification**
- `GET /api/leaderboard` - Global rankings  
- `GET /api/users/:id/points` - User score

**Authentication**
- `POST /api/auth/register` - Auto signup
- `POST /api/auth/login` - Login with JWT

---

## 📹 Demo Video

🎥 **Full Feature Demo** (10 min)  
[CitSci-Net Complete Walkthrough](https://youtube.com/watch?v=citsci-net-demo)

See: geofencing, gamification, offline sync, map interface, real-time validation

---

## 🧪 Testing

```bash
# Quick validation
npm run build          # Frontend build check
npm test              # Run test suites
```

---

## 🤝 Contributing

Found a bug or have ideas? Submit an issue or PR!

```bash
git checkout -b feature/YourFeature
git commit -m "Add YourFeature"
git push origin feature/YourFeature
```
5. Open a Pull Request

---

## � Hackathon Submission Highlights

**What's Integrated & Working:**
✅ Advanced geofencing with automatic OSM city boundary detection  
✅ Real-time GPS validation with Haversine distance calculations  
✅ Complete gamification system (points, badges, leaderboards, tiers)  
✅ Offline-first architecture with IndexedDB sync  
✅ Photo upload and metadata preservation  
✅ JWT authentication with auto-signup  
✅ Interactive Mapbox map with boundary visualization  
✅ Data quality scoring pipeline  
✅ Dark mode UI with responsive design  
✅ Cloud integration (Cloudinary, OpenStreetMap, OpenCage APIs)  

**Built in:** ~3 weeks  
**Stack:** React, Node.js, PostgreSQL, PostGIS  
**Lines of Code:** 10,000+ (frontend & backend combined)  

---

## 📋 Roadmap (Future Features)

- Mobile native apps (React Native/Flutter)
- ML-based automated data quality scoring
- Blockchain data certification
- Voice/audio observation capture
- Advanced AR visualization
- Scientific database integrations

---

## 🐛 Known Issues

- OSM boundary data not available in all countries
- Image uploads: 10MB max (Cloudinary limit)
- Geofencing accuracy: ±5-10m (typical GPS precision)
- Offline sync slower with 1000+ observations

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Credits

- OpenStreetMap community (boundary data)
- Cloudinary (image hosting)
- All open-source libraries used

---

**Hackathon Build**: February 2026  
**Status**: Production-Ready Demo ✓

*CitSci-Net: Making citizen science accessible and engaging*
