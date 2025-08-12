#!/bin/bash

# Star Wars Database Management Script
# Uses Alembic for database migrations and provides utilities for bulk operations

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"
VENV_PYTHON="$SCRIPT_DIR/.venv/bin/python"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Check if virtual environment exists
check_venv() {
    if [ ! -f "$VENV_PYTHON" ]; then
        print_error "Virtual environment not found at $VENV_PYTHON"
        print_status "Please run: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
}

# Database migration functions
init_db() {
    print_header "Initializing Database"
    cd "$BACKEND_DIR"
    
    print_status "Initializing Alembic migrations..."
    FLASK_APP=app.py $VENV_PYTHON -m flask db init 2>/dev/null || print_warning "Migration folder already exists"
    
    print_status "Creating initial migration..."
    FLASK_APP=app.py $VENV_PYTHON -m flask db migrate -m "Initial migration"
    
    print_status "Applying migrations..."
    FLASK_APP=app.py $VENV_PYTHON -m flask db upgrade
    
    print_success "Database initialized successfully!"
}

migrate_db() {
    print_header "Creating New Migration"
    cd "$BACKEND_DIR"
    
    local message="${1:-Auto migration}"
    print_status "Creating migration: $message"
    FLASK_APP=app.py $VENV_PYTHON -m flask db migrate -m "$message"
    
    print_success "Migration created successfully!"
    print_status "Don't forget to run: $0 upgrade"
}

upgrade_db() {
    print_header "Upgrading Database"
    cd "$BACKEND_DIR"
    
    print_status "Applying pending migrations..."
    FLASK_APP=app.py $VENV_PYTHON -m flask db upgrade
    
    print_success "Database upgraded successfully!"
}

downgrade_db() {
    print_header "Downgrading Database"
    cd "$BACKEND_DIR"
    
    local revision="${1:--1}"
    print_warning "Downgrading database to revision: $revision"
    FLASK_APP=app.py $VENV_PYTHON -m flask db downgrade "$revision"
    
    print_success "Database downgraded successfully!"
}

show_history() {
    print_header "Migration History"
    cd "$BACKEND_DIR"
    
    FLASK_APP=app.py $VENV_PYTHON -m flask db history
}

show_current() {
    print_header "Current Migration"
    cd "$BACKEND_DIR"
    
    FLASK_APP=app.py $VENV_PYTHON -m flask db current
}

# Data management functions
add_sample_data() {
    print_header "Adding Sample Star Wars Data"
    cd "$BACKEND_DIR"

    cat > bulk_seed.py << 'EOF'
#!/usr/bin/env python3

from app import create_app
from models import db, People, Planet, Vehicle

def seed_data():
    app = create_app()
    with app.app_context():
        # People (Characters)
        new_people = [
            {"name": "Mace Windu", "gender": "male", "birth_year": "72BBY", "image_url": "https://upload.wikimedia.org/wikipedia/en/6/66/Mace_Windu.png"},
            {"name": "Count Dooku", "gender": "male", "birth_year": "102BBY", "image_url": "https://upload.wikimedia.org/wikipedia/en/6/6f/Count_Dooku_Dooku.png"},
            {"name": "General Grievous", "gender": "male", "birth_year": "unknown", "image_url": "https://upload.wikimedia.org/wikipedia/en/6/6b/General_Grievous.png"},
            {"name": "Jango Fett", "gender": "male", "birth_year": "66BBY", "image_url": "https://upload.wikimedia.org/wikipedia/en/5/5e/Jango_Fett.png"},
            {"name": "Ahsoka Tano", "gender": "female", "birth_year": "36BBY", "image_url": "https://upload.wikimedia.org/wikipedia/en/7/7e/Ahsoka_Tano.png"}
        ]
        # Planets
        new_planets = [
            {"name": "Coruscant", "climate": "temperate", "population": "1000000000000", "image_url": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Coruscant.png"},
            {"name": "Kamino", "climate": "temperate", "population": "1000000000", "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Kamino.png"},
            {"name": "Geonosis", "climate": "temperate, arid", "population": "100000000000", "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Geonosis.png"},
            {"name": "Mustafar", "climate": "hot", "population": "20000", "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Mustafar.png"},
            {"name": "Kashyyyk", "climate": "tropical", "population": "45000000", "image_url": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Kashyyyk.png"}
        ]
        # Vehicles
        new_vehicles = [
            {"name": "Republic Attack Cruiser", "model": "Venator-class Star Destroyer", "manufacturer": "Kuat Drive Yards", "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Venator_class_star_destroyer.png"},
            {"name": "Jedi Interceptor", "model": "Eta-2 Actis-class light interceptor", "manufacturer": "Kuat Systems Engineering", "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Eta-2_Actis-class_light_interceptor.png"},
            {"name": "Trade Federation Landing Ship", "model": "C-9979 landing craft", "manufacturer": "Haor Chall Engineering", "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/7e/C-9979_landing_craft.png"},
            {"name": "Droid Control Ship", "model": "Lucrehulk-class Droid Control Ship", "manufacturer": "Hoersch-Kessel Drive, Inc.", "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Lucrehulk-class_Battleship.png"},
            {"name": "Naboo Royal Starship", "model": "J-type 327 Nubian royal starship", "manufacturer": "Theed Palace Space Vessel Engineering Corps", "image_url": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Naboo_Royal_Starship.png"}
        ]

        # Insert People
        for c in new_people:
            if not People.query.filter_by(name=c["name"]).first():
                db.session.add(People(**c))
        # Insert Planets
        for p in new_planets:
            if not Planet.query.filter_by(name=p["name"]).first():
                db.session.add(Planet(**p))
        # Insert Vehicles
        for v in new_vehicles:
            if not Vehicle.query.filter_by(name=v["name"]).first():
                db.session.add(Vehicle(**v))

        try:
            db.session.commit()
            print("\n🎉 Successfully seeded Star Wars data!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error seeding data: {e}")

if __name__ == "__main__":
    seed_data()
EOF

    print_status "Seeding Star Wars data..."
    $VENV_PYTHON bulk_seed.py
    rm bulk_seed.py
    print_success "Sample data added successfully!"
}

create_users() {
    print_header "Creating Sample Users"
    cd "$BACKEND_DIR"
    

    cat > bulk_users.py << 'EOF'
#!/usr/bin/env python3

from app import create_app
from models import db, User
from werkzeug.security import generate_password_hash
from datetime import datetime

def create_sample_users():
    """Create sample users for testing"""
    
    app = create_app()
    with app.app_context():
        
        sample_users = [
            {"email": "admin@starwars.com", "password": "admin123"},
            {"email": "1@1.com", "password": "1234567890"}
        ]
        
        print("Creating sample users...")
        created_count = 0
        
        for user_data in sample_users:
            # Check if user already exists
            existing = User.query.filter_by(email=user_data["email"]).first()
            if not existing:
                user = User(
                    email=user_data["email"],
                    password=generate_password_hash(user_data["password"]),
                    is_active=True,
                    created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                )
                db.session.add(user)
                created_count += 1
                print(f"✅ Created user: {user_data['email']}")
            else:
                print(f"⚠️  User {user_data['email']} already exists")
        
        try:
            db.session.commit()
            print(f"\n🎉 Successfully created {created_count} new users!")
            
            total_users = User.query.count()
            print(f"👥 Total users in database: {total_users}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating users: {e}")

if __name__ == "__main__":
    create_sample_users()
EOF
    
    print_status "Creating sample users..."
    $VENV_PYTHON bulk_users.py
    
    # Clean up temporary script
    rm bulk_users.py
    
    print_success "Sample users created successfully!"
}

remove_users() {
    print_header "Removing Users"
    cd "$BACKEND_DIR"
    
    local pattern="${1}"
    
    if [ -z "$pattern" ]; then
        print_error "Please provide an email pattern to remove users"
        print_status "Usage: $0 remove-users <email_pattern>"
        print_status "Example: $0 remove-users 'test@%' (removes all emails starting with test@)"
        return 1
    fi
    
    cat > remove_users.py << EOF
#!/usr/bin/env python3

from app import create_app
from models import db, User, Favorite

def remove_users_by_pattern(pattern):
    """Remove users matching email pattern"""
    
    app = create_app()
    with app.app_context():
        
        # Find users matching pattern
        if '%' in pattern:
            users = User.query.filter(User.email.like('$pattern')).all()
        else:
            users = User.query.filter(User.email == '$pattern').all()
        
        if not users:
            print(f"⚠️  No users found matching pattern: $pattern")
            return
        
        print(f"Found {len(users)} users matching pattern: $pattern")
        for user in users:
            print(f"  - {user.email}")
        
        # Confirm deletion
        confirm = input(f"\\nAre you sure you want to delete these {len(users)} users? (yes/no): ")
        
        if confirm.lower() in ['yes', 'y']:
            try:
                # Delete users (favorites will be cascade deleted)
                for user in users:
                    print(f"🗑️  Deleting user: {user.email}")
                    db.session.delete(user)
                
                db.session.commit()
                print(f"\\n✅ Successfully deleted {len(users)} users!")
                
                remaining_users = User.query.count()
                print(f"👥 Remaining users in database: {remaining_users}")
                
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error deleting users: {e}")
        else:
            print("❌ User deletion cancelled")

if __name__ == "__main__":
    remove_users_by_pattern('$pattern')
EOF
    
    $VENV_PYTHON remove_users.py
    
    # Clean up temporary script
    rm remove_users.py
}

list_users() {
    print_header "Database Users"
    cd "$BACKEND_DIR"
    
    cat > list_users.py << 'EOF'
#!/usr/bin/env python3

from app import create_app
from models import db, User, Favorite

def list_all_users():
    """List all users in the database"""
    
    app = create_app()
    with app.app_context():
        
        users = User.query.all()
        
        if not users:
            print("No users found in database")
            return
        
        print(f"Found {len(users)} users:")
        print("-" * 60)
        
        for user in users:
            favorites_count = Favorite.query.filter_by(user_id=user.id).count()
            status = "Active" if user.is_active else "Inactive"
            print(f"ID: {user.id:3} | Email: {user.email:25} | Status: {status:8} | Favorites: {favorites_count}")

if __name__ == "__main__":
    list_all_users()
EOF
    
    $VENV_PYTHON list_users.py
    
    # Clean up temporary script
    rm list_users.py
}

reset_db() {
    print_header "Resetting Database"
    
    print_warning "This will completely reset your database and lose all data!"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        print_status "Database reset cancelled"
        return
    fi
    
    cd "$BACKEND_DIR"
    
    print_status "Removing database file..."
    rm -f ../instance/database.db
    
    print_status "Dropping migrations..."
    rm -rf ../migrations/versions/*
    
    print_status "Reinitializing database..."
    init_db
    
    print_success "Database reset complete!"
}

backup_db() {
    print_header "Backing Up Database"
    
    local backup_name="backup_$(date +%Y%m%d_%H%M%S).db"
    local backup_path="$SCRIPT_DIR/backups/$backup_name"
    
    mkdir -p "$SCRIPT_DIR/backups"
    
    print_status "Creating backup: $backup_name"
    cp "$SCRIPT_DIR/instance/database.db" "$backup_path"
    
    print_success "Database backed up to: $backup_path"
}

# Help function
show_help() {
    echo -e "${CYAN}Star Wars Database Management Script${NC}"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo -e "${YELLOW}Database Migration Commands:${NC}"
    echo "  init                    Initialize database and migrations"
    echo "  migrate [message]       Create new migration (optional message)"
    echo "  upgrade                 Apply pending migrations"
    echo "  downgrade [revision]    Downgrade to revision (default: -1)"
    echo "  history                 Show migration history"
    echo "  current                 Show current migration"
    echo ""
    echo -e "${YELLOW}Data Management Commands:${NC}"
    echo "  add-data               Add sample Star Wars data"
    echo "  create-users           Create sample users for testing"
    echo "  remove-users <pattern> Remove users matching email pattern"
    echo "  list-users             List all users in database"
    echo ""
    echo -e "${YELLOW}Database Utilities:${NC}"
    echo "  reset                  Reset database completely (WARNING: destroys all data)"
    echo "  backup                 Create database backup"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  $0 init"
    echo "  $0 migrate 'Add new table'"
    echo "  $0 upgrade"
    echo "  $0 add-data"
    echo "  $0 create-users"
    echo "  $0 remove-users 'test@%'"
    echo "  $0 list-users"
    echo "  $0 backup"
}

# Main script logic
main() {
    check_venv
    
    case "${1:-help}" in
        "init")
            init_db
            ;;
        "migrate")
            migrate_db "$2"
            ;;
        "upgrade")
            upgrade_db
            ;;
        "downgrade")
            downgrade_db "$2"
            ;;
        "history")
            show_history
            ;;
        "current")
            show_current
            ;;
        "add-data")
            add_sample_data
            ;;
        "create-users")
            create_users
            ;;
        "remove-users")
            remove_users "$2"
            ;;
        "list-users")
            list_users
            ;;
        "reset")
            reset_db
            ;;
        "backup")
            backup_db
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
