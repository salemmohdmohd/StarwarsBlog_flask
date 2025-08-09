#!/bin/bash

# Star Wars Flask API Server Startup Script
# This script starts the Flask development server

echo "🚀 Starting Star Wars Flask API Server..."
echo "📁 Navigating to backend directory..."

# Navigate to the backend directory
cd "$(dirname "$0")/backend"

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found in backend directory"
    exit 1
fi

echo "🐍 Starting Flask server with python3..."
echo "🌐 Server will be available at:"
echo "   - http://127.0.0.1:3000"
echo "   - http://localhost:3000"
echo "🔧 Admin interface: http://127.0.0.1:3000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Start the Flask server
python3 app.py
