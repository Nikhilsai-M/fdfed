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
          email: 'supervisor@se.com', // Changed to match your pattern
          phone: '1234567890',
          username: 'supervisor@se.com', // Using email as username for pattern matching
          password: password1,
          role: 'supervisor'
        },
        {
          user_id: 'supervisor_2',
          first_name: 'John',
          last_name: 'Doe',
          email: 'supervisor1@se.com', // Changed to match your pattern
          phone: '0987654321',
          username: 'supervisor1@se.com', // Using email as username
          password: password2,
          role: 'supervisor'
        },
      ]);
      console.log('Test supervisors added to database');
    } else {
      console.log('Supervisors already exist in database');
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