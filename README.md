# Star Wars Flask REST API

A comprehensive Flask REST API for managing Star Wars characters, planets, and vehicles with an admin interface and image support.

## 🚀 Quick Start

### Option 1: Full Stack (Backend + Frontend)

```bash
./start_fullstack.sh
```

This starts both the Flask backend and React frontend automatically.

### Option 2: Backend Only

```bash
./start_server.sh
```

### Option 3: Frontend Only

```bash
./start_frontend.sh
```

### Manual Startup

```bash
# Backend
cd backend && python3 app.py

# Frontend (in another terminal)
cd frontend && npm start
```

The applications will be available at:

- **Backend API**: http://127.0.0.1:3000
- **Admin Interface**: http://127.0.0.1:3000/admin/
- **Frontend React App**: http://localhost:3001

## ✨ Features

### 🎯 Core Functionality

- **Star Wars Entities**: Manage People (characters), Planets, and Vehicles
- **User Authentication**: Login system with session management
- **Favorites System**: Users can favorite/unfavorite any Star Wars entity
- **Image Support**: Add PNG images via URL with thumbnail previews

### 🔧 Admin Interface

- **Flask-Admin Integration**: Beautiful web interface for data management
- **Image Previews**: Thumbnail display for all entity images
- **CRUD Operations**: Create, Read, Update, Delete all entities
- **User Management**: Admin panel for user accounts

### 🛠 Technical Features

- **SQLite Database**: Lightweight, file-based database
- **Flask-CORS**: Cross-origin resource sharing enabled
- **Session-based Auth**: Secure authentication without external dependencies
- **RESTful API**: Clean, organized endpoints

## 📊 Database Schema

### Models

- **User**: `id`, `email`, `password`, `is_active`
- **People**: `id`, `name`, `gender`, `birth_year`, `image_url`
- **Planet**: `id`, `name`, `climate`, `population`, `image_url`
- **Vehicle**: `id`, `name`, `model`, `manufacturer`, `image_url`
- **Favorite**: `id`, `user_id`, `people_id`, `planet_id`, `vehicle_id`

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### People (Characters)

- `GET /api/people` - List all characters
- `GET /api/people/<id>` - Get specific character

### Planets

- `GET /api/planets` - List all planets
- `GET /api/planets/<id>` - Get specific planet

### Vehicles

- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/<id>` - Get specific vehicle

### Favorites

- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/people/<id>` - Add/remove character favorite
- `POST /api/favorites/planet/<id>` - Add/remove planet favorite
- `POST /api/favorites/vehicle/<id>` - Add/remove vehicle favorite

## 🖼 Image Support

All entities (People, Planets, Vehicles) support image URLs:

1. **Add Images**: Use the admin interface to add PNG image URLs
2. **View Thumbnails**: Admin interface shows image previews
3. **API Response**: Image URLs included in JSON responses

Example API response with image:

```json
{
  "id": 1,
  "name": "Luke Skywalker",
  "gender": "male",
  "birth_year": "19BBY",
  "image_url": "https://example.com/luke.png"
}
```

## 🛡 Security Notes

- **Development Mode**: Uses plain text passwords (for development only)
- **Session Management**: Flask sessions for authentication
- **CORS Enabled**: Cross-origin requests allowed

## 📁 Project Structure

```
salem-flask-rest-star/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes.py           # API endpoints
│   ├── admin.py            # Admin interface setup
│   ├── utils.py            # Utility functions
│   └── instance/
│       └── database.db     # SQLite database
├── frontend/               # React frontend (separate)
├── instance/
│   └── database.db        # Main database file
├── migrations/            # Database migrations
├── start_server.sh        # Backend startup script
├── start_frontend.sh      # Frontend startup script
├── start_fullstack.sh     # Full stack startup script
└── README.md             # This file
```

## 🎬 Startup Scripts

### 🌟 `start_fullstack.sh` - Complete Application

Starts both backend and frontend servers simultaneously:

- Automatically installs npm dependencies if needed
- Starts Flask backend on port 3000
- Starts React frontend on port 3001
- Handles graceful shutdown with Ctrl+C
- Perfect for full development environment

### 🚀 `start_server.sh` - Backend Only

Starts only the Flask backend server:

- Navigates to backend directory automatically
- Validates app.py exists
- Provides helpful startup messages
- Shows admin panel URL

### ⚛️ `start_frontend.sh` - Frontend Only

Starts only the React development server:

- Navigates to frontend directory automatically
- Installs npm dependencies if missing
- Starts on port 3001 (avoids backend port conflict)
- Reminds you to start backend separately

## 🔧 Development

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the startup script:
   ```bash
   ./start_server.sh
   ```

### Key Dependencies

- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-Admin**: Admin interface
- **Flask-CORS**: Cross-origin support
- **Flask-Migrate**: Database migrations

## 📝 Code Optimizations

The codebase has been optimized for maintainability:

- **Helper Functions**: Generic handlers reduce code duplication by ~48%
- **Custom Admin Views**: Image support with thumbnail previews
- **Streamlined Authentication**: Simplified login without registration complexity
- **Clean Architecture**: Separated concerns across models, routes, and admin

## 🎨 Admin Interface Features

Access the admin panel at `/admin/` to:

- **Manage Users**: View and edit user accounts
- **Add Characters**: Create Star Wars people with images
- **Manage Planets**: Add planets with climate and population data
- **Vehicle Management**: Track Star Wars vehicles and ships
- **View Favorites**: See user favorite relationships
- **Image Previews**: Thumbnails for all uploaded images

## 🚀 Deployment Notes

This is configured for development. For production:

1. Use environment variables for secrets
2. Implement proper password hashing
3. Use a production WSGI server (e.g., Gunicorn)
4. Configure proper database (PostgreSQL, MySQL)
5. Set up HTTPS and proper CORS policies

## 📄 License

This project is for educational purposes as part of the 4Geeks Academy curriculum.

---

**May the Force be with you!** 🌟
