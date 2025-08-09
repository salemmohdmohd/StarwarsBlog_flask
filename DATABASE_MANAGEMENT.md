# Database Management Scripts

This repository includes comprehensive database management scripts that use Alembic for migrations and provide utilities for bulk operations.

## Scripts Overview

### 🚀 `db_manager.sh` - Full Database Management

Complete database management with Alembic integration.

### ⚡ `quick_db.sh` - Quick Operations

Simple shortcuts for common database tasks.

### 🔧 `backend/create_users.py` - User Management

Python script for creating users programmatically.

### 📊 `backend/add_data.py` - Sample Data

Python script for adding Star Wars sample data.

## Quick Start

```bash
# Make scripts executable (one time setup)
chmod +x db_manager.sh quick_db.sh

# Quick actions menu
./quick_db.sh

# Full database manager help
./db_manager.sh help
```

## Database Management Commands

### Migration Commands

```bash
# Initialize database and migrations
./db_manager.sh init

# Create new migration
./db_manager.sh migrate "Your migration message"

# Apply pending migrations
./db_manager.sh upgrade

# Downgrade database
./db_manager.sh downgrade

# Show migration history
./db_manager.sh history

# Show current migration
./db_manager.sh current
```

### Data Management Commands

```bash
# Add sample Star Wars data (characters, planets, vehicles)
./db_manager.sh add-data

# Create sample users for testing
./db_manager.sh create-users

# Remove users matching email pattern
./db_manager.sh remove-users "test@%"

# List all users in database
./db_manager.sh list-users
```

### Database Utilities

```bash
# Create database backup
./db_manager.sh backup

# Reset database completely (WARNING: destroys all data)
./db_manager.sh reset
```

## Quick Operations

```bash
# Quick menu
./quick_db.sh

# Direct actions
./quick_db.sh 1    # Add Star Wars data
./quick_db.sh 2    # Create sample users
./quick_db.sh 3    # List users
./quick_db.sh 4    # Backup database
./quick_db.sh 5    # Reset database
```

## Sample Users Created

When you run `./db_manager.sh create-users`, these test accounts are created:

| Email              | Password    | Character      |
| ------------------ | ----------- | -------------- |
| luke@jedi.com      | usetheforce | Luke Skywalker |
| leia@rebellion.com | rebel123    | Princess Leia  |
| han@smuggler.com   | falcon123   | Han Solo       |
| vader@empire.com   | darkside    | Darth Vader    |
| obi-wan@jedi.com   | highground  | Obi-Wan Kenobi |
| yoda@jedi.com      | master900   | Master Yoda    |
| admin@starwars.com | admin123    | Admin Account  |
| test@example.com   | test123     | Test Account   |

## Custom User Creation

```bash
# Create a single custom user
cd backend
python create_users.py email@example.com password123

# Create sample users
cd backend
python create_users.py
```

## Sample Data

The `add-data` command adds:

- **Characters**: Mace Windu, Count Dooku, General Grievous, Jango Fett, Ahsoka Tano
- **Planets**: Coruscant, Kamino, Geonosis, Mustafar, Kashyyyk
- **Vehicles**: Republic Attack Cruiser, Jedi Interceptor, Trade Federation Landing Ship, Droid Control Ship, Naboo Royal Starship

## Bulk User Operations

### Remove Users by Pattern

```bash
# Remove all test users
./db_manager.sh remove-users "test@%"

# Remove specific user
./db_manager.sh remove-users "user@example.com"

# Remove all users from a domain
./db_manager.sh remove-users "%@example.com"
```

### List Users with Details

```bash
./db_manager.sh list-users
```

Shows: ID, Email, Status, and Favorites count for each user.

## Database Backups

Backups are automatically timestamped and stored in `./backups/`:

```bash
./db_manager.sh backup
# Creates: ./backups/backup_20240809_123456.db
```

## Error Handling

All scripts include:

- ✅ Validation checks
- 🛡️ Error handling and rollback
- 🎨 Colored output for status messages
- 📝 Detailed logging

## Dependencies

Scripts automatically use your virtual environment:

- Python 3.13+
- Flask
- Flask-SQLAlchemy
- Flask-Migrate (Alembic)
- Werkzeug (for password hashing)

## File Structure

```
├── db_manager.sh           # Main database management script
├── quick_db.sh            # Quick operations script
├── backups/               # Database backups (auto-created)
├── backend/
│   ├── add_data.py        # Sample data script
│   ├── create_users.py    # User creation script
│   ├── app.py            # Flask application
│   └── models.py         # Database models
└── migrations/           # Alembic migration files
```

## Example Workflow

```bash
# 1. Initialize fresh database
./db_manager.sh init

# 2. Add sample data
./quick_db.sh 1

# 3. Create test users
./quick_db.sh 2

# 4. Check what we have
./quick_db.sh 3

# 5. Create backup before changes
./quick_db.sh 4

# 6. Make model changes, then create migration
./db_manager.sh migrate "Add new feature"

# 7. Apply migration
./db_manager.sh upgrade
```

## Troubleshooting

### Virtual Environment Issues

If you see "Virtual environment not found":

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Permission Issues

```bash
chmod +x db_manager.sh quick_db.sh
```

### Database Locked

If database is locked, ensure no other processes are using it:

```bash
./db_manager.sh backup    # Create backup first
./db_manager.sh reset     # Reset if needed
```
