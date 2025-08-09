from flask import jsonify, request
from backend.models import db, User, People, Planet, Vehicle, Favorite

def register_routes(app):
    @app.route('/user', methods=['GET'])
    def handle_hello():
        response_body = {"msg": "Hello, this is your GET /user response "}
        return jsonify(response_body), 200

    @app.route('/people', methods=['GET'])
    def get_people():
        people = People.query.all()
        return jsonify([p.serialize() for p in people]), 200

    @app.route('/people/<int:people_id>', methods=['GET'])
    def get_person(people_id):
        person = People.query.get_or_404(people_id)
        return jsonify(person.serialize()), 200

    @app.route('/planets', methods=['GET'])
    def get_planets():
        planets = Planet.query.all()
        return jsonify([p.serialize() for p in planets]), 200

    @app.route('/planets/<int:planet_id>', methods=['GET'])
    def get_planet(planet_id):
        planet = Planet.query.get_or_404(planet_id)
        return jsonify(planet.serialize()), 200

    @app.route('/vehicles', methods=['GET'])
    def get_vehicles():
        vehicles = Vehicle.query.all()
        return jsonify([v.serialize() for v in vehicles]), 200

    @app.route('/vehicles/<int:vehicle_id>', methods=['GET'])
    def get_vehicle(vehicle_id):
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        return jsonify(vehicle.serialize()), 200

    @app.route('/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        return jsonify([u.serialize() for u in users]), 200

    @app.route('/users/favorites', methods=['GET'])
    def get_user_favorites():
        user = User.query.get(1)
        if not user:
            return jsonify({"msg": "User not found"}), 404
        return jsonify([fav.serialize() for fav in user.favorites]), 200

    @app.route('/favorite/planet/<int:planet_id>', methods=['POST'])
    def add_favorite_planet(planet_id):
        user = User.query.get(1)
        planet = Planet.query.get_or_404(planet_id)
        fav = Favorite(user_id=user.id, planet_id=planet.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    @app.route('/favorite/people/<int:people_id>', methods=['POST'])
    def add_favorite_people(people_id):
        user = User.query.get(1)
        person = People.query.get_or_404(people_id)
        fav = Favorite(user_id=user.id, people_id=person.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

    @app.route('/favorite/vehicle/<int:vehicle_id>', methods=['POST'])
    def add_favorite_vehicle(vehicle_id):
        user = User.query.get(1)
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        fav = Favorite(user_id=user.id, vehicle_id=vehicle.id)
        db.session.add(fav)
        db.session.commit()
        return jsonify(fav.serialize()), 201

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
