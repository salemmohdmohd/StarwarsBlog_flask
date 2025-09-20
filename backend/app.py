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

    # Swagger UI setup
    from flask_swagger_ui import get_swaggerui_blueprint

    SWAGGER_URL = "/swagger"

    @app.route("/")
    def index():
        """Root route with a simple welcome message."""
        return """
            <h2>Welcome to the Star Wars API!</h2>
            <ul>
                <li><a href='/swagger'>API Documentation (Swagger UI)</a></li>
                <li><a href='/admin'>Admin Panel</a></li>
            </ul>
            """

    API_URL = "/static/swagger.json"
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL, API_URL, config={"app_name": "Star Wars API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

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
    def handle_api_exception(error):
        return jsonify(error.to_dict()), error.status_code

    return app


# Expose app for Flask CLI
app = create_app()

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=PORT, debug=True)
