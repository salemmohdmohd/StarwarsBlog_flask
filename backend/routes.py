from flask import jsonify, request, session
from backend.models import db, User, People, Planet, Vehicle, Favorite
from werkzeug.security import check_password_hash, generate_password_hash

def register_routes(app):
    
    # Authentication endpoints
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email and password are required"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"msg": "Email already registered"}), 400
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            email=data['email'],
            password=hashed_password,
            is_active=True
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Store user in session
        session['user_id'] = new_user.id
        session['user_email'] = new_user.email
        
        return jsonify({
            "msg": "User registered successfully",
            "user": new_user.serialize()
        }), 201
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"msg": "Email and password are required"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"msg": "Invalid email or password"}), 401
        
        if not user.is_active:
            return jsonify({"msg": "Account is deactivated"}), 401
        
        # Store user in session
        session['user_id'] = user.id
        session['user_email'] = user.email
        
        return jsonify({
            "msg": "Login successful",
            "user": user.serialize()
        }), 200
    
    @app.route('/api/auth/logout', methods=['POST'])
    def logout():
        session.clear()
        return jsonify({"msg": "Logout successful"}), 200
    
    @app.route('/api/auth/me', methods=['GET'])
    def get_current_user():
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Not authenticated"}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        return jsonify({"user": user.serialize()}), 200
    @app.route('/api/user', methods=['GET'])
    def handle_hello():
        response_body = {"msg": "Hello, this is your GET /api/user response "}
        return jsonify(response_body), 200

    @app.route('/api/people', methods=['GET'])
    def get_people():
        people = People.query.all()
        return jsonify([p.serialize() for p in people]), 200

    @app.route('/api/people/<int:people_id>', methods=['GET'])
    def get_person(people_id):
        person = People.query.get_or_404(people_id)
        return jsonify(person.serialize()), 200

    @app.route('/api/planets', methods=['GET'])
    def get_planets():
        planets = Planet.query.all()
        return jsonify([p.serialize() for p in planets]), 200

    @app.route('/api/planets/<int:planet_id>', methods=['GET'])
    def get_planet(planet_id):
        planet = Planet.query.get_or_404(planet_id)
        return jsonify(planet.serialize()), 200

    @app.route('/api/vehicles', methods=['GET'])
    def get_vehicles():
        vehicles = Vehicle.query.all()
        return jsonify([v.serialize() for v in vehicles]), 200

    @app.route('/api/vehicles/<int:vehicle_id>', methods=['GET'])
    def get_vehicle(vehicle_id):
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        return jsonify(vehicle.serialize()), 200

    @app.route('/api/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        return jsonify([u.serialize() for u in users]), 200

    @app.route('/api/users/favorites', methods=['GET'])
    def get_user_favorites():
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        return jsonify([fav.serialize() for fav in user.favorites]), 200

    @app.route('/api/favorite/planet/<int:planet_id>', methods=['POST'])
    def add_favorite_planet(planet_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        planet = Planet.query.get_or_404(planet_id)
        
        # Check if already favorited
        existing = Favorite.query.filter_by(user_id=user.id, planet_id=planet.id).first()
        if existing:
            return jsonify({"msg": "Planet already in favorites"}), 400
            
        fav = Favorite(user_id=user.id, planet_id=planet.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    @app.route('/api/favorite/people/<int:people_id>', methods=['POST'])
    def add_favorite_people(people_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        person = People.query.get_or_404(people_id)
        
        # Check if already favorited
        existing = Favorite.query.filter_by(user_id=user.id, people_id=person.id).first()
        if existing:
            return jsonify({"msg": "Person already in favorites"}), 400
            
        fav = Favorite(user_id=user.id, people_id=person.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    @app.route('/api/favorite/vehicle/<int:vehicle_id>', methods=['POST'])
    def add_favorite_vehicle(vehicle_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        
        # Check if already favorited
        existing = Favorite.query.filter_by(user_id=user.id, vehicle_id=vehicle.id).first()
        if existing:
            return jsonify({"msg": "Vehicle already in favorites"}), 400
            
        fav = Favorite(user_id=user.id, vehicle_id=vehicle.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    @app.route('/api/favorite/planet/<int:planet_id>', methods=['DELETE'])
    def remove_favorite_planet(planet_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        fav = Favorite.query.filter_by(user_id=user.id, planet_id=planet_id).first()
        if not fav:
            return jsonify({"msg": "Planet not in favorites"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Planet removed from favorites"}), 200

    @app.route('/api/favorite/people/<int:people_id>', methods=['DELETE'])
    def remove_favorite_people(people_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        fav = Favorite.query.filter_by(user_id=user.id, people_id=people_id).first()
        if not fav:
            return jsonify({"msg": "Person not in favorites"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Person removed from favorites"}), 200

    @app.route('/api/favorite/vehicle/<int:vehicle_id>', methods=['DELETE'])
    def remove_favorite_vehicle(vehicle_id):
        # Get user from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"msg": "Authentication required"}), 401
            
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        fav = Favorite.query.filter_by(user_id=user.id, vehicle_id=vehicle_id).first()
        if not fav:
            return jsonify({"msg": "Vehicle not in favorites"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Vehicle removed from favorites"}), 200

    @app.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
    def delete_favorite_planet(planet_id):
        user = User.query.get(1)
        fav = Favorite.query.filter_by(user_id=user.id, planet_id=planet_id).first()
        if not fav:
            return jsonify({"msg": "Favorite not found"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Favorite planet deleted"}), 200

    @app.route('/favorite/people/<int:people_id>', methods=['DELETE'])
    def delete_favorite_people(people_id):
        user = User.query.get(1)
        fav = Favorite.query.filter_by(user_id=user.id, people_id=people_id).first()
        if not fav:
            return jsonify({"msg": "Favorite not found"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Favorite people deleted"}), 200

    @app.route('/favorite/vehicle/<int:vehicle_id>', methods=['DELETE'])
    def delete_favorite_vehicle(vehicle_id):
        user = User.query.get(1)
        fav = Favorite.query.filter_by(user_id=user.id, vehicle_id=vehicle_id).first()
        if not fav:
            return jsonify({"msg": "Favorite not found"}), 404
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Favorite vehicle deleted"}), 200
