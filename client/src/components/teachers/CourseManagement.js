import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { getCourseById, updateStudentGrade } from '../../store/slices/courseSlice';

const CourseManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse: course, loading, error } = useSelector((state) => state.course);
  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeValue, setGradeValue] = useState('');

  useEffect(() => {
    dispatch(getCourseById(id));
  }, [dispatch, id]);

  const handleEditGrade = (studentId, currentGrade) => {
    setEditingGrade(studentId);
    setGradeValue(currentGrade || '');
  };

  const handleSaveGrade = async (studentId) => {
    try {
      await dispatch(updateStudentGrade({ courseId: id, studentId, grade: gradeValue })).unwrap();
      setEditingGrade(null);
      dispatch(getCourseById(id));
    } catch (err) {
      console.error('Failed to update grade:', err);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{course.title}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Course Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Course Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Course Code
                </Typography>
                <Typography variant="body1">{course.courseCode}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Schedule
                </Typography>
                <Typography variant="body1">
                  {course.schedule?.day} {course.schedule?.startTime} - {course.schedule?.endTime}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Room
                </Typography>
                <Typography variant="body1">{course.schedule?.room}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Enrollment
                </Typography>
                <Typography variant="body1">
                  {course.enrolledStudents?.length}/{course.capacity}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Student Grades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Student Grades
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.enrolledStudents?.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {editingGrade === student._id ? (
                          <TextField
                            size="small"
                            value={gradeValue}
                            onChange={(e) => setGradeValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveGrade(student._id);
                              }
                            }}
                          />
                        ) : (
                          student.grade || 'Not Graded'
                        )}
                      </TableCell>
                      <TableCell>
                        {editingGrade === student._id ? (
                          <Tooltip title="Save">
                            <IconButton
                              size="small"
                              onClick={() => handleSaveGrade(student._id)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Edit Grade">
                            <IconButton
                              size="small"
                              onClick={() => handleEditGrade(student._id, student.grade)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Course Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grade Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Add grade distribution chart here */}
              <Typography variant="body2" color="text.secondary">
                Grade distribution chart will be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Attendance Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Add attendance summary here */}
              <Typography variant="body2" color="text.secondary">
                Attendance summary will be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseManagement; 