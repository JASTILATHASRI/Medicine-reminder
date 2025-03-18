const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  medicines: [
    {
      medicineName: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      days: {
        type: [String], 
        required: true
      },
      reminderTime: { 
        type: String, 
        required: true
      }
    }
  ],
  opted: {
    type: Boolean,
    enum: [true, false],
    default: true 
  }
});

module.exports = mongoose.model("User", userSchema);
