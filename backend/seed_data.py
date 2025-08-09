"""
Data seeding script to populate the database with Star Wars dummy data
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.models import db, User, People, Planet, Vehicle

def seed_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create a test user
        user = User(
            email="test@example.com",
            password="password123",
            is_active=True
        )
        db.session.add(user)
        
        # Add People (Characters)
        people_data = [
            {
                "name": "Luke Skywalker",
                "gender": "male",
                "birth_year": "19BBY"
            },
            {
                "name": "Leia Organa",
                "gender": "female", 
                "birth_year": "19BBY"
            },
            {
                "name": "Han Solo",
                "gender": "male",
                "birth_year": "29BBY"
            }
        ]
        
        for person_data in people_data:
            person = People(**person_data)
            db.session.add(person)
        
        # Add Planets
        planets_data = [
            {
                "name": "Tatooine",
                "climate": "arid",
                "population": "200000"
            },
            {
                "name": "Alderaan",
                "climate": "temperate",
                "population": "2000000000"
            },
            {
                "name": "Hoth",
                "climate": "frozen",
                "population": "unknown"
            }
        ]
        
        for planet_data in planets_data:
            planet = Planet(**planet_data)
            db.session.add(planet)
        
        # Add Vehicles
        vehicles_data = [
            {
                "name": "X-wing",
                "model": "T-65 X-wing",
                "manufacturer": "Incom Corporation"
            },
            {
                "name": "TIE Fighter",
                "model": "Twin Ion Engine",
                "manufacturer": "Sienar Fleet Systems"
            },
            {
                "name": "Millennium Falcon",
                "model": "YT-1300 light freighter",
                "manufacturer": "Corellian Engineering Corporation"
            }
        ]
        
        for vehicle_data in vehicles_data:
            vehicle = Vehicle(**vehicle_data)
            db.session.add(vehicle)
        
        # Commit all changes
        db.session.commit()
        print("✅ Database seeded successfully!")
        print(f"Added {len(people_data)} people")
        print(f"Added {len(planets_data)} planets")
        print(f"Added {len(vehicles_data)} vehicles")
        print("Added 1 test user")

if __name__ == "__main__":
    seed_data()
