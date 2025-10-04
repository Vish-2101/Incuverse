import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  dateOfBirth: {
    type: String,
  },
  address: {
    type: String,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  idType: {
    type: String,
  },
  idNumber: {
    type: String,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;