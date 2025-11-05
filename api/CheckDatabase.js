// Save as checkDatabase.js in your api folder
// Run: node checkDatabase.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import PhoneApplication from './models/phoneApplication.model.js';
import LaptopApplication from './models/laptopApplication.model.js';
import User from './models/user.model.js';

dotenv.config({ path: '../.env' });

async function checkDatabase() {
  try {
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB\n');

    // 1. Check all users
    console.log('=== 👥 ALL USERS ===');
    const users = await User.find({}).select('user_id username email').lean();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - user_id: ${user.user_id}, username: ${user.username}, email: ${user.email}`);
    });

    // 2. Check all phone applications
    console.log('\n=== 📱 ALL PHONE APPLICATIONS ===');
    const phoneApps = await PhoneApplication.find({}).lean();
    console.log(`Found ${phoneApps.length} phone applications:`);
    phoneApps.forEach(app => {
      console.log(`  - ID: ${app._id}`);
      console.log(`    user_id: "${app.user_id}"`);
      console.log(`    brand: ${app.brand}, model: ${app.model}`);
      console.log(`    status: ${app.status}`);
      console.log(`    created_at: ${app.created_at}`);
      console.log('');
    });

    // 3. Check all laptop applications
    console.log('=== 💻 ALL LAPTOP APPLICATIONS ===');
    const laptopApps = await LaptopApplication.find({}).lean();
    console.log(`Found ${laptopApps.length} laptop applications:`);
    laptopApps.forEach(app => {
      console.log(`  - ID: ${app._id}`);
      console.log(`    user_id: "${app.user_id}"`);
      console.log(`    brand: ${app.brand}, model: ${app.model}`);
      console.log(`    status: ${app.status}`);
      console.log(`    created_at: ${app.created_at}`);
      console.log('');
    });

    // 4. Check for specific user_id
    if (users.length > 0) {
      const testUserId = users[0].user_id;
      console.log(`\n=== 🔍 TESTING WITH USER_ID: "${testUserId}" ===`);
      
      const userPhones = await PhoneApplication.find({ user_id: testUserId }).lean();
      const userLaptops = await LaptopApplication.find({ user_id: testUserId }).lean();
      
      console.log(`Phone applications for this user: ${userPhones.length}`);
      console.log(`Laptop applications for this user: ${userLaptops.length}`);
    }

    // 5. Check for the specific Samsung phone you mentioned
    console.log('\n=== 🔍 SEARCHING FOR SAMSUNG GALAXY ===');
    const samsungPhone = await PhoneApplication.findOne({ 
      brand: 'SAMSUNG', 
      model: 'galaxy1' 
    }).lean();
    
    if (samsungPhone) {
      console.log('✅ Found Samsung Galaxy phone:');
      console.log('   _id:', samsungPhone._id);
      console.log('   user_id:', `"${samsungPhone.user_id}"`);
      console.log('   user_id type:', typeof samsungPhone.user_id);
      console.log('   user_id length:', samsungPhone.user_id?.length);
      console.log('   status:', samsungPhone.status);
      console.log('   created_at:', samsungPhone.created_at);
      
      // Check if this user_id exists in Users collection
      const matchingUser = await User.findOne({ user_id: samsungPhone.user_id });
      if (matchingUser) {
        console.log('   ✅ Matching user found:', matchingUser.username);
      } else {
        console.log('   ❌ No matching user found in Users collection!');
        console.log('   This might be the issue - application has user_id but no user exists');
      }
    } else {
      console.log('❌ Samsung Galaxy phone not found');
    }

    console.log('\n=== ✅ DATABASE CHECK COMPLETE ===\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
    process.exit(0);
  }
}

checkDatabase();