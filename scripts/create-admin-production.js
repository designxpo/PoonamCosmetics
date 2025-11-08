const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Admin user data
const adminUser = {
  name: 'Admin',
  email: 'admin@poonamcosmetics.com',
  password: 'admin123', // Will be hashed
  role: 'admin'
};

async function createAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ 
      email: adminUser.email 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      console.log('\n💡 If you need to reset the password, delete the existing admin first.');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);

    // Insert admin user
    console.log('👤 Creating admin user...');
    await db.collection('users').insertOne({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@poonamcosmetics.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 You can now login at:');
    console.log('   Local: http://localhost:3000/admin/login');
    console.log('   Production: https://poonamcosmetics.vercel.app/admin/login\n');

    await mongoose.disconnect();
    console.log('✅ Done!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdminUser();
