import { Supervisor, SupervisorActivity } from "../models/supervisor.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const supervisorSignin = async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    console.log(`Attempting to authenticate supervisor with username: ${username}`);
    
    if (!username || !password) {
      return next(errorHandler(400, 'Username and password are required'));
    }

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
    
    const passwordMatch = await bcrypt.compare(password, supervisor.password);
    
    if (!passwordMatch) {
      console.log(`Password does not match for username: ${username}`);
      
      await SupervisorActivity.create({
        supervisor_id: supervisor.user_id,
        action: 'Failed login attempt'
      });
      
      return next(errorHandler(400, 'Invalid username or password'));
    }
    
    console.log(`Authentication successful for username: ${username}`);
    
    await SupervisorActivity.create({
      supervisor_id: supervisor.user_id,
      action: 'Successful login'
    });

    // ✅ CRITICAL CHANGE — supervisorType added
    const token = jwt.sign(
      {
        user_id: supervisor.user_id,
        username: supervisor.username,
        role: 'supervisor',
        supervisorType: supervisor.type   // ← NEW
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const { password: pass, ...supervisorData } = supervisor;

    res.cookie('supervisor_access_token', token, {
      httpOnly: true
      // secure: true  ← enable in production
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


// Check if username/email exists as supervisor
export const checkSupervisorExists = async (req, res, next) => {
  const { username } = req.query;
  
  try {
    if (!username) {
      return res.json({ exists: false });
    }

    const supervisor = await Supervisor.findOne({
      $or: [
        { username: username.trim() },
        { email: username.trim().toLowerCase() }
      ]
    }).select('username email').lean();
    
    res.json({ exists: !!supervisor });

  } catch (error) {
    console.error('Error checking supervisor:', error);
    res.json({ exists: false });
  }
}