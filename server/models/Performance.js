const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: {
    type: [String],
    required: true
  },
  grades: {
    type: [String],
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Performance', PerformanceSchema); 