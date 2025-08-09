#!/bin/bash

# Star Wars React Frontend Startup Script
# This script starts the React development server

echo "⚛️  Starting Star Wars React Frontend..."
echo "📁 Navigating to frontend directory..."

# Navigate to the frontend directory
cd "$(dirname "$0")/frontend"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

echo "⚛️  Starting React development server..."
echo "🌐 Frontend will be available at:"
echo "   - http://localhost:3001"
echo "   - http://127.0.0.1:3001"
echo ""
echo "🔗 Make sure the backend is running at http://127.0.0.1:3000"
echo "Press Ctrl+C to stop the development server"
echo "----------------------------------------"

# Start the React development server
npm start
