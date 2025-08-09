import os
from flask_admin import Admin
from backend.models import db, User, People, Planet, Vehicle, Favorite
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import generate_password_hash
from wtforms import PasswordField, ValidationError
from wtforms.validators import DataRequired, Optional, Length

class UserModelView(ModelView):
    # Hide the password field from the list view
    column_exclude_list = ['password']
    
    # Don't show password in forms, we'll handle it separately
    form_excluded_columns = ['password']
    
    # Add a custom password field
    form_extra_fields = {
        'password_input': PasswordField('Password', 
                                      description='Required for new users. Leave blank when editing to keep current password.',
                                      validators=[DataRequired(message='Password is required'), 
                                                Length(min=6, message='Password must be at least 6 characters')])
    }
    
    def scaffold_form(self):
        """Override to ensure our custom field is properly included"""
        form_class = super(UserModelView, self).scaffold_form()
        print(f"🔍 scaffold_form called, form fields: {list(form_class._formfield_class.keys()) if hasattr(form_class, '_formfield_class') else 'unknown'}")
        return form_class
    
    def create_form(self, obj=None):
        """Override to make password required for creation"""
        form = super(UserModelView, self).create_form(obj)
        # For creation, password is required
        if hasattr(form, 'password_input'):
            form.password_input.validators = [DataRequired(message='Password is required for new users')]
        return form
    
    def edit_form(self, obj=None):
        """Override to make password optional for editing"""
        form = super(UserModelView, self).edit_form(obj)
        # For editing, password is optional
        if hasattr(form, 'password_input'):
            form.password_input.validators = [Optional()]
            form.password_input.description = 'Leave blank to keep current password'
        return form
    
    def validate_form(self, form):
        """Additional form validation"""
        print(f"🔍 validate_form called")
        print(f"   Form data: {form.data}")
        
        # Check if this is a creation or edit
        is_creating = not bool(getattr(form, '_obj', None))
        print(f"   is_creating: {is_creating}")
        
        if is_creating and hasattr(form, 'password_input'):
            if not form.password_input.data or not form.password_input.data.strip():
                # Create a new list from the tuple and reassign
                errors_list = list(form.password_input.errors)
                errors_list.append("Password is required for new users")
                form.password_input.errors = tuple(errors_list)
                return False
        
        return super(UserModelView, self).validate_form(form)
    
    def on_model_delete(self, model):
        """Handle user deletion by cleaning up favorites first"""
        print(f"🗑️  Deleting user: {model.email}")
        
        # Count favorites to be deleted
        favorite_count = len(model.favorites) if model.favorites else 0
        if favorite_count > 0:
            print(f"   Will also delete {favorite_count} favorite(s)")
        
        # The cascade delete will handle the favorites automatically
        return super(UserModelView, self).on_model_delete(model)
    
    def on_model_change(self, form, model, is_created):
        """Hash password before saving"""
        print(f"🔍 on_model_change called:")
        print(f"   Model: {model.email if hasattr(model, 'email') else 'new user'}")
        print(f"   is_created: {is_created}")
        print(f"   Form data: {form.data}")
        print(f"   Form errors: {form.errors}")
        
        if hasattr(form, 'password_input'):
            password_data = form.password_input.data
            print(f"   password_input exists: True")
            print(f"   password_input.data: {'***' if password_data else 'None'}")
            print(f"   password_input length: {len(password_data) if password_data else 0}")
            
            if password_data and len(password_data.strip()) > 0:
                # Hash the password
                hashed_password = generate_password_hash(password_data)
                model.password = hashed_password
                print(f"   ✅ Password hashed successfully")
                print(f"   Hash starts with: {hashed_password[:30]}...")
            elif is_created:
                print(f"   ❌ ERROR: No password provided for new user")
                raise ValidationError("Password is required for new users")
            else:
                print(f"   ℹ️  No password change for existing user")
        else:
            print(f"   ❌ password_input field not found in form!")
        
        # Call parent method
        super(UserModelView, self).on_model_change(form, model, is_created)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here with custom UserModelView for password hashing
    admin.add_view(UserModelView(User, db.session))
    admin.add_view(ModelView(People, db.session))
    admin.add_view(ModelView(Planet, db.session))
    admin.add_view(ModelView(Vehicle, db.session))
    admin.add_view(ModelView(Favorite, db.session))

    # You can duplicate that line to add new models
    # admin.add_view(ModelView(YourModelName, db.session))