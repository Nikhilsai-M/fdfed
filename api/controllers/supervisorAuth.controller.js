import { Supervisor, SupervisorActivity } from "../models/supervisor.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const supervisorSignin = async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    console.log(`Attempting to authenticate supervisor with username: ${username}`);
    
    // Validate input
    if (!username || !password) {
      return next(errorHandler(400, 'Username and password are required'));
    }

    // Find supervisor by username (email) or email
    const supervisor = await Supervisor.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    }).lean();
    
    if (!supervisor) {
      console.log(`No supervisor found with username/email: ${username}`);
      return next(errorHandler(404, 'Invalid username or password'));
    }
    
    console.log(`Supervisor found: ${supervisor.first_name} ${supervisor.last_name}`);
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, supervisor.password);
    
    if (!passwordMatch) {
      console.log(`Password does not match for username: ${username}`);
      
      // Log failed attempt
      await SupervisorActivity.create({
        supervisor_id: supervisor.user_id,
        action: 'Failed login attempt'
      });
      
      return next(errorHandler(400, 'Invalid username or password'));
    }
    
    console.log(`Authentication successful for username: ${username}`);
    
    // Log successful login
    await SupervisorActivity.create({
      supervisor_id: supervisor.user_id,
      action: 'Successful login'
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: supervisor._id, 
        user_id: supervisor.user_id,
        role: 'supervisor' 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: pass, ...supervisorData } = supervisor;

    // Send response with cookie
    res.cookie('supervisor_access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }).status(200).json({
      success: true,
      supervisor: supervisorData,
      role: 'supervisor'
    });

  } catch(error) {
    console.error('Supervisor signin error:', error);
    next(errorHandler(500, 'Error during supervisor signin: ' + error.message));
  }
}