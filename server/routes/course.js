const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// @route   POST api/courses
// @desc    Create a new course
// @access  Private (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, startDate, endDate } = req.body;
    const course = new Course({
      name,
      description,
      startDate,
      endDate,
      teacher: req.user.id,
      students: [],
      grades: [],
      comments: []
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/courses/:id/students
// @desc    Add a student to a course
// @access  Private (Teacher only)
router.post('/:id/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { studentEmail } = req.body;
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (course.students.includes(student._id)) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    course.students.push(student._id);
    course.grades.push({
      student: student._id,
      grade: null,
      date: new Date()
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/courses/:id/grades/:studentId
// @desc    Update a student's grade
// @access  Private (Teacher only)
router.put('/:id/grades/:studentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { grade } = req.body;
    const gradeIndex = course.grades.findIndex(
      g => g.student.toString() === req.params.studentId
    );

    if (gradeIndex === -1) {
      return res.status(404).json({ message: 'Student not found in course' });
    }

    course.grades[gradeIndex].grade = grade;
    course.grades[gradeIndex].date = new Date();

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/courses/:id/comments
// @desc    Add a comment for a student
// @access  Private (Teacher only)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { studentId, text } = req.body;
    course.comments.push({
      student: studentId,
      text,
      date: new Date()
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/courses/:id/comments/:commentId
// @desc    Update a comment
// @access  Private (Teacher only)
router.put('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { text } = req.body;
    const commentIndex = course.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    course.comments[commentIndex].text = text;
    course.comments[commentIndex].date = new Date();

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/courses/:id/performance/:studentId
// @desc    Get student performance data
// @access  Private (Teacher only)
router.get('/:id/performance/:studentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const studentGrades = course.grades
      .filter(g => g.student.toString() === req.params.studentId)
      .map(g => ({
        grade: g.grade,
        date: g.date
      }));

    const studentComments = course.comments
      .filter(c => c.student.toString() === req.params.studentId)
      .map(c => ({
        text: c.text,
        date: c.date
      }));

    res.json({
      grades: studentGrades,
      comments: studentComments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 