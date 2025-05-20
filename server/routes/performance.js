const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Performance = require('../models/Performance');

// @route   GET api/performance/student/:id
// @desc    Get student performance data
// @access  Private
router.get('/student/:id', auth, async (req, res) => {
  try {
    const performance = await Performance.findOne({ student: req.params.id })
      .populate('student', ['name', 'rollNumber'])
      .populate('teacher', ['name']);

    if (!performance) {
      return res.status(404).json({ message: 'Performance data not found' });
    }

    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST api/performance/student/:id
// @desc    Add new performance data for a student
// @access  Private (Teacher only)
router.post('/student/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { subjects, grades, comments } = req.body;

    // Create new performance data
    const performance = new Performance({
      student: req.params.id,
      teacher: req.user.id,
      subjects,
      grades,
      comments,
      semester: req.body.semester || 'Current',
      date: Date.now()
    });

    await performance.save();
    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT api/performance/student/:id
// @desc    Update student performance data
// @access  Private (Teacher only)
router.put('/student/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { subjects, grades, comments } = req.body;

    let performance = await Performance.findOne({ student: req.params.id });
    if (!performance) {
      return res.status(404).json({ message: 'Performance data not found' });
    }

    // Update performance data
    performance.subjects = subjects || performance.subjects;
    performance.grades = grades || performance.grades;
    performance.comments = comments || performance.comments;
    performance.date = Date.now();

    await performance.save();
    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET api/performance/history/:id
// @desc    Get student performance history
// @access  Private
router.get('/history/:id', auth, async (req, res) => {
  try {
    const performanceHistory = await Performance.find({ student: req.params.id })
      .sort({ date: -1 })
      .populate('teacher', ['name']);

    res.json(performanceHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 