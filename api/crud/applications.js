import PhoneApplication from '../models/phoneApplication.model.js';
import LaptopApplication from '../models/laptopApplication.model.js';
import { SupervisorActivity } from '../models/supervisor.model.js';

// Helper function to get next sequence
async function getNextSequence(name) {
  // Simple implementation - you might want to use a proper counter collection
  const count = await PhoneApplication.countDocuments();
  return count + 1;
}

export async function initializeApplications() {
  try {
    // Check and insert test phone applications
    const phoneAppCount = await PhoneApplication.countDocuments();
    if (phoneAppCount === 0) {
      await PhoneApplication.insertMany([
        {
          id: await getNextSequence('phone_application_id'),
          user_id: 'user_123',
          brand: 'Samsung',
          model: 'Galaxy S20',
          ram: '8GB',
          rom: '128GB',
          processor: 'Exynos 990',
          network: '4G',
          size: '6.2"',
          weight: '163g',
          device_age: '2 years',
          switching_on: 'Yes',
          phone_calls: 'Yes',
          cameras_working: 'Yes',
          battery_issues: 'No',
          physically_damaged: 'No',
          sound_issues: 'No',
          location: 'New York',
          email: 'test@example.com',
          phone: '1234567890',
          battery: '4000mAh',
          camera: '12MP',
          os: 'Android 11',
          image_path: 'https://example.com/image1.jpg',
          status: 'pending',
          created_at: new Date('2025-03-20T10:00:00Z'),
        },
        {
          id: await getNextSequence('phone_application_id'),
          user_id: 'user_124',
          brand: 'Apple',
          model: 'iPhone 12',
          ram: '4GB',
          rom: '64GB',
          processor: 'A14 Bionic',
          network: '5G',
          size: '6.1"',
          weight: '164g',
          device_age: '1 year',
          switching_on: 'Yes',
          phone_calls: 'Yes',
          cameras_working: 'Yes',
          battery_issues: 'Yes',
          physically_damaged: 'No',
          sound_issues: 'No',
          location: 'California',
          email: 'test2@example.com',
          phone: '0987654321',
          battery: '2810mAh',
          camera: '12MP',
          os: 'iOS 14',
          image_path: 'https://example.com/image2.jpg',
          status: 'approved',
          created_at: new Date('2025-03-21T12:00:00Z'),
        },
      ]);
      console.log('Test phone applications added to database');
    }

    // Check and insert test laptop applications
    const laptopAppCount = await LaptopApplication.countDocuments();
    if (laptopAppCount === 0) {
      await LaptopApplication.insertMany([
        {
          id: await getNextSequence('laptop_application_id'),
          user_id: 'user_123',
          brand: 'Dell',
          model: 'XPS 13',
          ram: '16GB',
          storage: '512GB',
          processor: 'Intel i7',
          generation: '11th',
          display_size: '13.4"',
          weight: '1.2kg',
          os: 'Windows 11',
          device_age: '1.5 years',
          battery_issues: 'No',
          location: 'Texas',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1112223333',
          image_path: 'https://example.com/image3.jpg',
          status: 'pending',
          created_at: new Date('2025-03-22T09:00:00Z'),
        },
        {
          id: await getNextSequence('laptop_application_id'),
          user_id: 'user_124',
          brand: 'Apple',
          model: 'MacBook Air',
          ram: '8GB',
          storage: '256GB',
          processor: 'M1',
          generation: '',
          display_size: '13.3"',
          weight: '1.29kg',
          os: 'macOS',
          device_age: '2 years',
          battery_issues: 'Yes',
          location: 'Florida',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '4445556666',
          image_path: 'https://example.com/image4.jpg',
          status: 'rejected',
          created_at: new Date('2025-03-22T14:00:00Z'),
        },
      ]);
      console.log('Test laptop applications added to database');
    }

    // Check and insert test supervisor activity
    const activityCount = await SupervisorActivity.countDocuments();
    if (activityCount === 0) {
      await SupervisorActivity.insertMany([
        {
          supervisor_id: 'supervisor_1',
          action: 'Updated phone application #1 to approved with price 500',
          timestamp: new Date('2025-03-21T12:30:00Z'),
        },
        {
          supervisor_id: 'supervisor_1',
          action: 'Added phone #12345 to inventory with price ₹500, condition Used, and 10% discount',
          timestamp: new Date('2025-03-21T13:00:00Z'),
        },
        {
          supervisor_id: 'supervisor_1',
          action: 'Updated laptop application #2 to rejected: Damaged screen',
          timestamp: new Date('2025-03-22T14:30:00Z'),
        },
      ]);
      console.log('Test supervisor activity added to database');
    }
  } catch (error) {
    console.error('Error initializing applications:', error);
  }
}