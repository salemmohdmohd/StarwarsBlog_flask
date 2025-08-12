"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import os

from admin import setup_admin
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from models import db
from routes import api as api_bp
from utils import APIException, generate_sitemap


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False

    # Session configuration
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", "dev-secret-key-change-in-production"
    )

    # Simple SQLite database configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        "sqlite:////Users/salemmohd/Documents/GitHub/salem-flask-rest-star/instance/database.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    Migrate(app, db)

    # JWT setup
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "super-secret-key"
    )  # Change in production!
    jwt = JWTManager(app)

    # CORS for frontend
    CORS(app, supports_credentials=True, origins=os.getenv("FRONTEND_URL", "*"))

    setup_admin(app)
    app.register_blueprint(api_bp)

    @app.errorhandler(APIException)
    def handle_invalid_usage(error):
        return jsonify(error.to_dict()), error.status_code

    # Optionally, remove or update the root route to point to docs or a landing page

    return app


# Expose app for Flask CLI
app = create_app()

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=PORT, debug=False)
