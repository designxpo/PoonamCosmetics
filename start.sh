#!/bin/bash

# Poonam Cosmetics - Quick Start Script
# This script helps you get started quickly

echo "🌟 Poonam Cosmetics - Quick Start"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please run: cp .env.local.example .env.local"
    exit 1
fi

echo "✅ Environment configuration found"
echo ""

# Start MongoDB
echo "📦 Starting MongoDB..."
brew services start mongodb-community
sleep 3

# Check if MongoDB is running
if brew services list | grep -q "mongodb-community.*started"; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB may not be running. Please check manually."
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "📝 IMPORTANT NOTES:"
echo "   1. After the server starts, create an admin user"
echo "   2. Visit http://localhost:3000 to see your website"
echo "   3. Admin panel is at http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Start the development server
npm run dev
