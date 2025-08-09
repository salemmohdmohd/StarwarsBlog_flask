# Star Wars Flask REST API

A comprehensive Flask REST API for managing Star Wars characters, planets, a## 🚀 Quick Start

### Full Stack Application

```bash
./start_fullstack.sh
```

This starts both the Flask backend and React frontend automatically.

### Manual Startup

````bash
# Backend
cd backend && python app.py

# Frontend (in another terminal)
cd frontend && npm start
```h an admin interface and image support.

## � Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.7+** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package manager (comes with Python)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **Node.js & npm** - [Download Node.js](https://nodejs.org/) (for frontend)

## 🔽 Step-by-Step Installation

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/4GeeksAcademy/salem-flask-rest-star.git

# Navigate to the project directory
cd salem-flask-rest-star
````

### 2. Set Up Python Virtual Environment

```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
# Install backend dependencies
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Return to project root
cd ..
```

### 5. Set Up Database

```bash
# Run database management script to initialize
./db_manager.sh init

# Add sample Star Wars data
./db_manager.sh add-data

# Create sample users
./db_manager.sh create-users
```

### 6. Start the Application

```bash
# Option 1: Start full application (recommended)
./start_fullstack.sh

# Option 2: Manual startup (if needed)
# Backend (terminal 1):
cd backend && python app.py

# Frontend (terminal 2):
cd frontend && npm start
```

## 🌐 Access Your Application

After successful startup, you can access:

- **Frontend React App**: http://localhost:3001
- **Backend API**: http://127.0.0.1:3000
- **Admin Interface**: http://127.0.0.1:3000/admin/

### 🔑 Test Login Credentials

Use these accounts to test the application:

| Email              | Password    | Character      |
| ------------------ | ----------- | -------------- |
| luke@jedi.com      | usetheforce | Luke Skywalker |
| leia@rebellion.com | rebel123    | Princess Leia  |
| vader@empire.com   | darkside    | Darth Vader    |
| admin@starwars.com | admin123    | Admin Account  |

## �🚀 Quick Start

### Option 1: Full Stack (Backend + Frontend)

```bash
./start_fullstack.sh
```

This starts both the Flask backend and React frontend automatically.

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
│   ├── add_data.py         # Sample data script
│   ├── create_users.py     # User creation script
│   └── instance/
│       └── database.db     # SQLite database
├── frontend/               # React frontend
│   ├── src/                # React source code
│   ├── index.html          # Main HTML with Death Star favicon
│   └── death-star.svg      # Custom Star Wars favicon
├── instance/
│   └── database.db        # Main database file
├── migrations/            # Database migrations
├── backups/               # Database backups
├── db_manager.sh          # Database management script
├── quick_db.sh            # Quick database operations
├── start_fullstack.sh     # Full stack startup script
├── DATABASE_MANAGEMENT.md # Database management guide
└── README.md             # This file
```

## 🛠 Database Management

The project includes comprehensive database management tools:

### Quick Operations

```bash
./quick_db.sh              # Interactive menu for common tasks
./db_manager.sh help        # Full database management options
```

### Sample Commands

```bash
./db_manager.sh add-data    # Add Star Wars sample data
./db_manager.sh create-users # Create test users
./db_manager.sh list-users  # View all users
./db_manager.sh backup      # Create database backup
```

## 🎬 Startup Scripts

### 🌟 `start_fullstack.sh` - Complete Application

Starts both backend and frontend servers simultaneously:

- Automatically installs npm dependencies if needed
- Starts Flask backend on port 3000
- Starts React frontend on port 3001
- Handles graceful shutdown with Ctrl+C

## 🔧 Development

This application includes all the tools you need for development:

- **Automatic Setup**: Step-by-step installation guide above
- **Database Management**: Built-in scripts for data and user management
- **Hot Reload**: Frontend development server with live updates
- **Admin Interface**: Web-based database management
- **Sample Data**: Pre-built Star Wars characters, planets, and vehicles

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
