#!/bin/bash
# Activate virtual environment and run Flask backend on port 5000
cd "$(dirname "$0")"
source .venv/bin/activate
export FLASK_APP=backend/app.py
export FLASK_ENV=development
flask run --port 5000
