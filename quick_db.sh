#!/bin/bash


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "🌟 Star Wars Database Quick Actions"
echo "=================================="

case "${1:-menu}" in
    "1"|"add-data")
        echo "Adding sample Star Wars data..."
        "$SCRIPT_DIR/.venv/bin/python" -c '
import sys
sys.path.insert(0, "./backend")
from app import create_app
from models import db, People, Planet, Vehicle
app = create_app()
with app.app_context():
    new_characters = [
        {"name": "Mace Windu", "gender": "male", "birth_year": "72BBY", "image_url": "https://starwars-visualguide.com/assets/img/characters/51.jpg"},
        {"name": "Count Dooku", "gender": "male", "birth_year": "102BBY", "image_url": "https://starwars-visualguide.com/assets/img/characters/67.jpg"},
        {"name": "General Grievous", "gender": "male", "birth_year": "unknown", "image_url": "https://starwars-visualguide.com/assets/img/characters/79.jpg"},
        {"name": "Jango Fett", "gender": "male", "birth_year": "66BBY", "image_url": "https://starwars-visualguide.com/assets/img/characters/22.jpg"},
        {"name": "Ahsoka Tano", "gender": "female", "birth_year": "36BBY", "image_url": "https://starwars-visualguide.com/assets/img/characters/62.jpg"}
    ]
    new_planets = [
        {"name": "Coruscant", "climate": "temperate", "population": "1000000000000", "image_url": "https://starwars-visualguide.com/assets/img/planets/9.jpg"},
        {"name": "Kamino", "climate": "temperate", "population": "1000000000", "image_url": "https://starwars-visualguide.com/assets/img/planets/10.jpg"},
        {"name": "Geonosis", "climate": "temperate, arid", "population": "100000000000", "image_url": "https://starwars-visualguide.com/assets/img/planets/11.jpg"},
        {"name": "Mustafar", "climate": "hot", "population": "20000", "image_url": "https://starwars-visualguide.com/assets/img/planets/13.jpg"},
        {"name": "Kashyyyk", "climate": "tropical", "population": "45000000", "image_url": "https://starwars-visualguide.com/assets/img/planets/14.jpg"}
    ]
    new_vehicles = [
        {"name": "Republic Attack Cruiser", "model": "Venator-class Star Destroyer", "manufacturer": "Kuat Drive Yards", "image_url": "https://starwars-visualguide.com/assets/img/vehicles/63.jpg"},
        {"name": "Jedi Interceptor", "model": "Eta-2 Actis-class light interceptor", "manufacturer": "Kuat Systems Engineering", "image_url": "https://starwars-visualguide.com/assets/img/vehicles/65.jpg"},
        {"name": "Trade Federation Landing Ship", "model": "C-9979 landing craft", "manufacturer": "Haor Chall Engineering", "image_url": "https://starwars-visualguide.com/assets/img/vehicles/32.jpg"},
        {"name": "Droid Control Ship", "model": "Lucrehulk-class Droid Control Ship", "manufacturer": "Hoersch-Kessel Drive, Inc.", "image_url": "https://starwars-visualguide.com/assets/img/vehicles/33.jpg"},
        {"name": "Naboo Royal Starship", "model": "J-type 327 Nubian royal starship", "manufacturer": "Theed Palace Space Vessel Engineering Corps", "image_url": "https://starwars-visualguide.com/assets/img/vehicles/39.jpg"}
    ]
    print("Adding new characters...")
    for char_data in new_characters:
        existing = People.query.filter_by(name=char_data["name"]).first()
        if not existing:
            character = People(**char_data)
            db.session.add(character)
            print(f"Added character: {char_data["name"]}")
        else:
            print(f"Character {char_data["name"]} already exists")
    print("\nAdding new planets...")
    for planet_data in new_planets:
        existing = Planet.query.filter_by(name=planet_data["name"]).first()
        if not existing:
            planet = Planet(**planet_data)
            db.session.add(planet)
            print(f"Added planet: {planet_data["name"]}")
        else:
            print(f"Planet {planet_data["name"]} already exists")
    print("\nAdding new vehicles...")
    for vehicle_data in new_vehicles:
        existing = Vehicle.query.filter_by(name=vehicle_data["name"]).first()
        if not existing:
            vehicle = Vehicle(**vehicle_data)
            db.session.add(vehicle)
            print(f"Added vehicle: {vehicle_data["name"]}")
        else:
            print(f"Vehicle {vehicle_data["name"]} already exists")
    try:
        db.session.commit()
        print("\n✅ Successfully added all new data to the database!")
        total_characters = People.query.count()
        total_planets = Planet.query.count()
        total_vehicles = Vehicle.query.count()
        print(f"\nDatabase now contains:")
        print(f"📊 Characters: {total_characters}")
        print(f"🌍 Planets: {total_planets}")
        print(f"🚀 Vehicles: {total_vehicles}")
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error adding data: {e}")
'
        ;;
    "2"|"add-users")
        echo "Creating sample users..."
        "$SCRIPT_DIR/.venv/bin/python" -c '
import sys
sys.path.insert(0, "./backend")
from app import create_app
from models import db, User
from werkzeug.security import generate_password_hash
app = create_app()
with app.app_context():
    sample_users = [
        {"email": "luke@jedi.com", "password": "usetheforce"},
        {"email": "leia@rebellion.com", "password": "rebel123"},
        {"email": "han@smuggler.com", "password": "falcon123"},
        {"email": "vader@empire.com", "password": "darkside"},
        {"email": "obi-wan@jedi.com", "password": "highground"},
        {"email": "yoda@jedi.com", "password": "master900"},
        {"email": "admin@starwars.com", "password": "admin123"},
        {"email": "test@example.com", "password": "test123"}
    ]
    print("🌟 Creating sample Star Wars users...")
    created_count = 0
    for user_data in sample_users:
        existing = User.query.filter_by(email=user_data["email"]).first()
        if not existing:
            user = User(
                email=user_data["email"],
                password=generate_password_hash(user_data["password"]),
                is_active=True
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
        if created_count > 0:
            print("\n📝 Login credentials for testing:")
            print("=" * 40)
            for user_data in sample_users:
                existing = User.query.filter_by(email=user_data["email"]).first()
                if existing:
                    print(f"Email: {user_data['email']}")
                    print(f"Password: {user_data['password']}")
                    print("-" * 30)
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating users: {e}")
'
        ;;
    "3"|"list-users")
        echo "Listing all users..."
        echo "(Functionality removed)"
        ;;
    "4"|"backup")
        echo "Creating database backup..."
        echo "(Functionality removed)"
        ;;
    "5"|"reset")
        echo "Resetting database..."
        echo "(Functionality removed)"
        ;;
    "menu"|*)
        echo ""
        echo "Quick Actions:"
        echo "1. Add Star Wars data     - $0 1"
        echo "2. Create sample users    - $0 2"
        echo "3. List users            - $0 3"
        echo "4. Backup database       - $0 4"
        echo "5. Reset database        - $0 5"
        echo ""
    echo "(Full db_manager.sh functionality removed from this script)"
        ;;
esac
