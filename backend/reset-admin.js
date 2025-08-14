// filepath: c:\Users\ahmad\Documents\Projects\hotel-app\backend\reset-admin.js
const { sequelize, User } = require('./models');

async function resetAdmin() {
  try {
    // Sync models (do NOT use force: true unless you want to drop all tables)
    await sequelize.sync();

    // Delete all existing admin users
    await User.destroy({ where: { role: 'admin' } });
    console.log('🗑️ All admin users deleted.');

    // Create new admin (plain password, let model hash it)
    await User.create({
      name: 'Admin User',
      email: 'admin@alihsanhotel.com',
      password: 'Ahmed@2002', // plain password!
      role: 'admin',
      isActive: true
    });
    console.log('✅ New admin user created successfully');
    console.log('📧 Email: admin@alihsanhotel.com');
    console.log('🔑 Password: Ahmed@2002');
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
  }
}

resetAdmin();
