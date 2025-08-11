#!/bin/bash

echo "🚀 QuickCourt Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is installed and running."
fi

echo "📦 Setting up Backend..."
cd backend
npm install

if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚙️  Please update the .env file with your configuration"
fi

echo "📦 Setting up Frontend..."
cd ../frontend/QuickCourt
npm install

echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend/QuickCourt && npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
