import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { getTeacherCourses } from '../../store/slices/teacherSlice';
import { getTeacherProfile } from '../../store/slices/teacherSlice';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, profile, loading, error } = useSelector((state) => state.teacher);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/');
      return;
    }
    dispatch(getTeacherProfile());
    dispatch(getTeacherCourses());
  }, [dispatch, user, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome, {profile?.firstName} {profile?.lastName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Teacher Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Courses
            </Typography>
            <Typography variant="h3">
              {courses?.length || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Students
            </Typography>
            <Typography variant="h3">
              {courses?.reduce((total, course) => total + (course.students?.length || 0), 0) || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Courses
            </Typography>
            <Typography variant="h3">
              {courses?.filter(course => course.status === 'active')?.length || 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Course List */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Your Courses</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/courses/create')}
            >
              Create New Course
            </Button>
          </Box>

          <Grid container spacing={3}>
            {courses?.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {course.description}
                    </Typography>
                    <Typography variant="body2">
                      Students: {course.students?.length || 0}
                    </Typography>
                    <Typography variant="body2">
                      Status: {course.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/courses/${course._id}/manage`)}
                    >
                      Manage Course
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/courses/${course._id}/students`)}
                    >
                      View Students
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 