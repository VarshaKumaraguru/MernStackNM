const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'firstName lastName email')
      .populate('courses.course');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('courses.course');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new student
router.post('/', auth, async (req, res) => {
  try {
    const {
      user,
      studentId,
      dateOfBirth,
      gender,
      address,
      contactNumber
    } = req.body;

    const student = new Student({
      user,
      studentId,
      dateOfBirth,
      gender,
      address,
      contactNumber
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add course to student
router.post('/:id/courses', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { course, semester, year } = req.body;
    student.courses.push({ course, semester, year });
    
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course grade
router.put('/:id/courses/:courseId', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const course = student.courses.id(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.grade = req.body.grade;
    await student.save();
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 