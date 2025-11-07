import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';

export async function initializeAdmins() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminPassword1 = await bcrypt.hash('Admin@123', 10);
      const adminPassword2 = await bcrypt.hash('Admin@456', 10);
      
      await Admin.insertMany([
        {
          admin_id: 'ADMIN001',
          password: adminPassword1,
          security_token: 'TOKEN001',
          name: 'Main Administrator',
        },
        {
          admin_id: 'ADMIN002',
          password: adminPassword2,
          security_token: 'TOKEN002',
          name: 'Secondary Administrator',
        }
      ]);
      console.log('✅ Test admins added to database');
    } else {
      console.log('✅ Admins already exist in database');
    }
  } catch (error) {
    console.error('❌ Error initializing admins:', error);
  }
}