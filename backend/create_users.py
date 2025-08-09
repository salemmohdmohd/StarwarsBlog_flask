#!/usr/bin/env python3

from app import create_app
from models import db, User
from werkzeug.security import generate_password_hash
import sys

def create_sample_users():
    """Create sample users for testing"""
    
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
            # Check if user already exists
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
            sys.exit(1)

def create_custom_user(email, password):
    """Create a single custom user"""
    
    app = create_app()
    with app.app_context():
        
        # Check if user already exists
        existing = User.query.filter_by(email=email).first()
        if existing:
            print(f"⚠️  User {email} already exists")
            return
        
        try:
            user = User(
                email=email,
                password=generate_password_hash(password),
                is_active=True
            )
            db.session.add(user)
            db.session.commit()
            
            print(f"✅ Successfully created user: {email}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating user: {e}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) == 3:
        # Create custom user: python create_users.py email@example.com password123
        email = sys.argv[1]
        password = sys.argv[2]
        create_custom_user(email, password)
    elif len(sys.argv) == 1:
        # Create sample users: python create_users.py
        create_sample_users()
    else:
        print("Usage:")
        print("  python create_users.py                    # Create sample users")
        print("  python create_users.py email password     # Create custom user")
        sys.exit(1)
