"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
db_url = os.getenv("DATABASE_URL")

from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from backend.utils import APIException, generate_sitemap
from backend.admin import setup_admin
from backend.models import db
from backend.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    
    # Session configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    db_url = os.getenv("DATABASE_URL")
    if db_url is not None:
        app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)
    CORS(app)
    setup_admin(app)
    register_routes(app)

    @app.errorhandler(APIException)
    def handle_invalid_usage(error):
        return jsonify(error.to_dict()), error.status_code

    @app.route('/')
    def sitemap():
        return generate_sitemap(app)

    return app

if __name__ == '__main__':
    app = create_app()
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
