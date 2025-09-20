import os

from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from markupsafe import Markup
from models import Favorite, People, Planet, User, Vehicle, db

 
class ImageModelView(ModelView):
    """Custom ModelView for models with image URLs"""

    def _list_thumbnail(view, context, model, name):
        if model.image_url:
            return Markup(
                f'<img src="{model.image_url}" style="max-width: 80px; max-height: 80px;">'
            )
        return ""

    column_formatters = {"image_url": _list_thumbnail}


class PeopleView(ImageModelView):
    column_list = ["name", "gender", "birth_year", "image_url"]
    column_labels = {"image_url": "Image Preview"}
    form_columns = ["name", "gender", "birth_year", "image_url"]


class PlanetView(ImageModelView):
    column_list = ["name", "climate", "population", "image_url"]
    column_labels = {"image_url": "Image Preview"}
    form_columns = ["name", "climate", "population", "image_url"]


class VehicleView(ImageModelView):
    column_list = ["name", "model", "manufacturer", "image_url"]
    column_labels = {"image_url": "Image Preview"}
    form_columns = ["name", "model", "manufacturer", "image_url"]


class FavoriteView(ModelView):
    column_list = ["user.email", "people.name", "planet.name", "vehicle.name"]
    column_labels = {
        "user.email": "User Email",
        "people.name": "Favorite Character",
        "planet.name": "Favorite Planet",
        "vehicle.name": "Favorite Vehicle",
    }


def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")
    app.config["FLASK_ADMIN_SWATCH"] = "cerulean"
    admin = Admin(
        app, name="Star Wars Admin", template_mode="bootstrap3", index_view=None
    )

    # Add model views with image support
    admin.add_view(ModelView(User, db.session))
    admin.add_view(PeopleView(People, db.session))
    admin.add_view(PlanetView(Planet, db.session))
    admin.add_view(VehicleView(Vehicle, db.session))
    admin.add_view(FavoriteView(Favorite, db.session))
