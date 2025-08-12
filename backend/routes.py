from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import Favorite, People, Planet, User, Vehicle, db
from werkzeug.security import check_password_hash, generate_password_hash

api = Blueprint("api", __name__)


@api.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 409
    from datetime import datetime

    hashed_password = generate_password_hash(password)
    user = User(
        email=email,
        password=hashed_password,
        is_active=True,
        created_at=datetime.utcnow().isoformat(),
    )
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=str(user.id))
    return (
        jsonify(
            {
                "message": "User created successfully",
                "access_token": access_token,
                "user": user.serialize(),
            }
        ),
        201,
    )


def get_authenticated_user():
    """Get the currently authenticated user from JWT"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return None, jsonify({"msg": "User not found"}), 404
    return user, None, 200


def handle_favorite_action(entity_type, entity_id, action):
    """Generic handler for favorite add/remove operations"""
    user, error_response, status_code = get_authenticated_user()
    if error_response:
        return error_response, status_code

    # Get the entity model and field name
    models = {
        "planet": (Planet, "planet_id"),
        "people": (People, "people_id"),
        "vehicle": (Vehicle, "vehicle_id"),
    }
    model_class, field_name = models[entity_type]

    entity = model_class.query.get_or_404(entity_id)
    filter_kwargs = {"user_id": user.id, field_name: entity.id}
    existing = Favorite.query.filter_by(**filter_kwargs).first()

    if action == "add":
        if existing:
            return jsonify({"msg": f"{entity_type.title()} already in favorites"}), 400
        fav = Favorite(user_id=user.id, **{field_name: entity.id})
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    elif action == "remove":
        if not existing:
            return jsonify({"msg": f"{entity_type.title()} not in favorites"}), 404
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"msg": f"{entity_type.title()} removed from favorites"}), 200


def handle_entity_request(entity_type, entity_id=None):
    """Generic handler for entity GET requests"""
    models = {"people": People, "planets": Planet, "vehicles": Vehicle}
    model_class = models[entity_type]

    if entity_id:
        entity = model_class.query.get_or_404(entity_id)
        return jsonify(entity.serialize()), 200
    else:
        entities = model_class.query.all()
        return jsonify([e.serialize() for e in entities]), 200


# JWT Login Endpoint
@api.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401
    if not user.is_active:
        return jsonify({"message": "Account is deactivated"}), 403
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


# JWT Protected Example
@api.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "Access granted", "user": user.serialize()}), 200


# Star Wars entity endpoints (public)
@api.route("/api/people", methods=["GET"])
def get_people():
    people = People.query.all()
    return jsonify([p.serialize() for p in people]), 200


@api.route("/api/people/<int:people_id>", methods=["GET"])
def get_person(people_id):
    person = People.query.get_or_404(people_id)
    return jsonify(person.serialize()), 200


@api.route("/api/planets", methods=["GET"])
def get_planets():
    planets = Planet.query.all()
    return jsonify([p.serialize() for p in planets]), 200


@api.route("/api/planets/<int:planet_id>", methods=["GET"])
def get_planet(planet_id):
    planet = Planet.query.get_or_404(planet_id)
    return jsonify(planet.serialize()), 200


@api.route("/api/vehicles", methods=["GET"])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([v.serialize() for v in vehicles]), 200


@api.route("/api/vehicles/<int:vehicle_id>", methods=["GET"])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get_or_404(vehicle_id)
    return jsonify(vehicle.serialize()), 200


# Favorites endpoints (JWT protected)
@api.route("/api/users/favorites", methods=["GET"])
@jwt_required()
def get_user_favorites():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify([fav.serialize() for fav in user.favorites]), 200


@api.route("/api/favorite/planet/<int:planet_id>", methods=["POST"])
@jwt_required()
def add_favorite_planet(planet_id):
    return handle_favorite_action_jwt("planet", planet_id, "add")


@api.route("/api/favorite/people/<int:people_id>", methods=["POST"])
@jwt_required()
def add_favorite_people(people_id):
    return handle_favorite_action_jwt("people", people_id, "add")


@api.route("/api/favorite/vehicle/<int:vehicle_id>", methods=["POST"])
@jwt_required()
def add_favorite_vehicle(vehicle_id):
    return handle_favorite_action_jwt("vehicle", vehicle_id, "add")


@api.route("/api/favorite/planet/<int:planet_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite_planet(planet_id):
    return handle_favorite_action_jwt("planet", planet_id, "remove")


@api.route("/api/favorite/people/<int:people_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite_people(people_id):
    return handle_favorite_action_jwt("people", people_id, "remove")


@api.route("/api/favorite/vehicle/<int:vehicle_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite_vehicle(vehicle_id):
    return handle_favorite_action_jwt("vehicle", vehicle_id, "remove")


# Helper for JWT-protected favorite actions
def handle_favorite_action_jwt(entity_type, entity_id, action):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    # Get the entity model and field name
    models = {
        "planet": (Planet, "planet_id"),
        "people": (People, "people_id"),
        "vehicle": (Vehicle, "vehicle_id"),
    }
    model_class, field_name = models[entity_type]
    entity = model_class.query.get_or_404(entity_id)
    filter_kwargs = {"user_id": user.id, field_name: entity.id}
    existing = Favorite.query.filter_by(**filter_kwargs).first()
    if action == "add":
        if existing:
            return jsonify({"msg": f"{entity_type.title()} already in favorites"}), 400
        fav = Favorite(user_id=user.id, **{field_name: entity.id})
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201
    elif action == "remove":
        if not existing:
            return jsonify({"msg": f"{entity_type.title()} not in favorites"}), 404
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"msg": f"{entity_type.title()} removed from favorites"}), 200
