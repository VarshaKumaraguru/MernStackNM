const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  currentSemester: {
    type: Number,
    default: 1
  },
  gpa: {
    type: Number,
    default: 0.0
  },
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F', 'W', 'I', null],
      default: null
    },
    semester: Number,
    year: Number
  }],
  goals: [{
    title: String,
    description: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema); 