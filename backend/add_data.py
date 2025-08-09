#!/usr/bin/env python3

from app import create_app
from models import db, People, Planet, Vehicle

def add_sample_data():
    """Add 5 more characters, planets, and vehicles to the database"""
    
    app = create_app()
    with app.app_context():
        # Additional Characters
        new_characters = [
            {
                "name": "Mace Windu",
                "gender": "male",
                "birth_year": "72BBY",
                "image_url": "https://starwars-visualguide.com/assets/img/characters/51.jpg"
            },
            {
                "name": "Count Dooku",
                "gender": "male", 
                "birth_year": "102BBY",
                "image_url": "https://starwars-visualguide.com/assets/img/characters/67.jpg"
            },
            {
                "name": "General Grievous",
                "gender": "male",
                "birth_year": "unknown",
                "image_url": "https://starwars-visualguide.com/assets/img/characters/79.jpg"
            },
            {
                "name": "Jango Fett",
                "gender": "male",
                "birth_year": "66BBY", 
                "image_url": "https://starwars-visualguide.com/assets/img/characters/22.jpg"
            },
            {
                "name": "Ahsoka Tano",
                "gender": "female",
                "birth_year": "36BBY",
                "image_url": "https://starwars-visualguide.com/assets/img/characters/62.jpg"
            }
        ]

        # Additional Planets
        new_planets = [
            {
                "name": "Coruscant",
                "climate": "temperate",
                "population": "1000000000000",
                "image_url": "https://starwars-visualguide.com/assets/img/planets/9.jpg"
            },
            {
                "name": "Kamino",
                "climate": "temperate",
                "population": "1000000000",
                "image_url": "https://starwars-visualguide.com/assets/img/planets/10.jpg"
            },
            {
                "name": "Geonosis",
                "climate": "temperate, arid",
                "population": "100000000000",
                "image_url": "https://starwars-visualguide.com/assets/img/planets/11.jpg"
            },
            {
                "name": "Mustafar",
                "climate": "hot",
                "population": "20000",
                "image_url": "https://starwars-visualguide.com/assets/img/planets/13.jpg"
            },
            {
                "name": "Kashyyyk",
                "climate": "tropical",
                "population": "45000000",
                "image_url": "https://starwars-visualguide.com/assets/img/planets/14.jpg"
            }
        ]

        # Additional Vehicles
        new_vehicles = [
            {
                "name": "Republic Attack Cruiser",
                "model": "Venator-class Star Destroyer",
                "manufacturer": "Kuat Drive Yards",
                "image_url": "https://starwars-visualguide.com/assets/img/vehicles/63.jpg"
            },
            {
                "name": "Jedi Interceptor",
                "model": "Eta-2 Actis-class light interceptor",
                "manufacturer": "Kuat Systems Engineering",
                "image_url": "https://starwars-visualguide.com/assets/img/vehicles/65.jpg"
            },
            {
                "name": "Trade Federation Landing Ship",
                "model": "C-9979 landing craft",
                "manufacturer": "Haor Chall Engineering",
                "image_url": "https://starwars-visualguide.com/assets/img/vehicles/32.jpg"
            },
            {
                "name": "Droid Control Ship",
                "model": "Lucrehulk-class Droid Control Ship",
                "manufacturer": "Hoersch-Kessel Drive, Inc.",
                "image_url": "https://starwars-visualguide.com/assets/img/vehicles/33.jpg"
            },
            {
                "name": "Naboo Royal Starship",
                "model": "J-type 327 Nubian royal starship",
                "manufacturer": "Theed Palace Space Vessel Engineering Corps",
                "image_url": "https://starwars-visualguide.com/assets/img/vehicles/39.jpg"
            }
        ]

        # Add characters
        print("Adding new characters...")
        for char_data in new_characters:
            # Check if character already exists
            existing = People.query.filter_by(name=char_data["name"]).first()
            if not existing:
                character = People(**char_data)
                db.session.add(character)
                print(f"Added character: {char_data['name']}")
            else:
                print(f"Character {char_data['name']} already exists")

        # Add planets
        print("\nAdding new planets...")
        for planet_data in new_planets:
            # Check if planet already exists
            existing = Planet.query.filter_by(name=planet_data["name"]).first()
            if not existing:
                planet = Planet(**planet_data)
                db.session.add(planet)
                print(f"Added planet: {planet_data['name']}")
            else:
                print(f"Planet {planet_data['name']} already exists")

        # Add vehicles
        print("\nAdding new vehicles...")
        for vehicle_data in new_vehicles:
            # Check if vehicle already exists
            existing = Vehicle.query.filter_by(name=vehicle_data["name"]).first()
            if not existing:
                vehicle = Vehicle(**vehicle_data)
                db.session.add(vehicle)
                print(f"Added vehicle: {vehicle_data['name']}")
            else:
                print(f"Vehicle {vehicle_data['name']} already exists")

        # Commit all changes
        try:
            db.session.commit()
            print("\n✅ Successfully added all new data to the database!")
            
            # Show current counts
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

if __name__ == "__main__":
    add_sample_data()
