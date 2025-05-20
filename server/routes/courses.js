const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'firstName lastName email')
      .populate('prerequisites');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('prerequisites')
      .populate('enrolledStudents');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new course
router.post('/', auth, async (req, res) => {
  try {
    const {
      courseCode,
      title,
      description,
      credits,
      instructor,
      prerequisites,
      semester,
      capacity,
      schedule
    } = req.body;

    const course = new Course({
      courseCode,
      title,
      description,
      credits,
      instructor,
      prerequisites,
      semester,
      capacity,
      schedule
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll student in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { studentId } = req.body;

    // Check if course is full
    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    course.enrolledStudents.push(studentId);
    await course.save();
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove student from course
router.delete('/:id/enroll/:studentId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      student => student.toString() !== req.params.studentId
    );
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 