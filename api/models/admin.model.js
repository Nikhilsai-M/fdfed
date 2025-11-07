import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  security_token: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;