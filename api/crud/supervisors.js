import { Supervisor } from '../models/supervisor.model.js';
import bcrypt from 'bcryptjs';

export async function initializeSupervisors() {
  try {
    const supervisorCount = await Supervisor.countDocuments();

    if (supervisorCount === 0) {
      const password1 = await bcrypt.hash('Supervisor@123', 10);
      const password2 = await bcrypt.hash('Supervisor@456', 10);

      await Supervisor.insertMany([
        {
          user_id: 'supervisor_1',
          first_name: 'Nikhil',
          last_name: 'Sai',
          email: 'supervisor@se.com',
          phone: '1234567890',
          username: 'supervisor@se.com',
          password: password1,
          role: 'supervisor',
          type: 'phone',
        },
        {
          user_id: 'supervisor_2',
          first_name: 'John',
          last_name: 'Doe',
          email: 'supervisor1@se.com',
          phone: '0987654321',
          username: 'supervisor1@se.com',
          password: password2,
          role: 'supervisor',
          type: 'laptop',
        },
      ]);
      console.log('✅ Test supervisors seeded');

    } else {
      // ── MIGRATION: patch any existing records missing the `type` field ──
      const migrated1 = await Supervisor.updateOne(
        { email: 'supervisor@se.com', type: { $exists: false } },
        { $set: { type: 'phone' } }
      );
      const migrated2 = await Supervisor.updateOne(
        { email: 'supervisor1@se.com', type: { $exists: false } },
        { $set: { type: 'laptop' } }
      );

      if (migrated1.modifiedCount || migrated2.modifiedCount) {
        console.log('✅ Migrated existing supervisors with missing type field');
      } else {
        console.log('ℹ️  Supervisors already exist and are up to date');
      }
    }
  } catch (error) {
    console.error('Error initializing supervisors:', error);
  }
}


export async function getAllSupervisors() {
  try {
    const supervisors = await Supervisor.find().select('-password').lean();
    return supervisors;
  } catch (error) {
    console.error('Error getting all supervisors:', error);
    throw error;
  }
}


export async function deleteSupervisor(userId) {
  try {
    const result = await Supervisor.deleteOne({ user_id: userId });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    throw error;
  }
}