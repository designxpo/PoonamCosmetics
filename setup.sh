#!/bin/bash

echo "🚀 Setting up Poonam Cosmetics E-commerce Website..."
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ .env.local created. Please update with your configuration."
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Update .env.local with your MongoDB connection string and settings"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - NEXT_PUBLIC_WHATSAPP_NUMBER: Your WhatsApp number (format: 919999999999)"
echo "   - JWT_SECRET: A secure random string"
echo "   - NEXTAUTH_SECRET: Another secure random string"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   brew services start mongodb-community"
echo ""
echo "3. Create your first admin user:"
echo "   After starting the dev server, run:"
echo "   curl -X POST http://localhost:3000/api/admin/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\": \"admin@poonamcosmetics.com\", \"password\": \"YourSecurePassword123\", \"name\": \"Admin User\"}'"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "6. Access admin panel at http://localhost:3000/admin"
echo ""
echo "📖 For more information, see README.md"
echo ""
