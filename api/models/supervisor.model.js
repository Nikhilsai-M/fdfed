import mongoose from "mongoose";

const supervisorActivitySchema = new mongoose.Schema({
  supervisor_id: { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const supervisorSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'supervisor'
  },
  // NEW: defines what type of listings this supervisor handles
  type: {
    type: String,
    enum: ['phone', 'laptop'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const Supervisor = mongoose.model("Supervisor", supervisorSchema);
const SupervisorActivity = mongoose.model("SupervisorActivity", supervisorActivitySchema);

export { Supervisor, SupervisorActivity };