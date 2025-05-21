import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { getStudentProfile } from '../../store/slices/studentSlice';
import { getCourses } from '../../store/slices/courseSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector(
    (state) => state.student
  );
  const { courses, loading: coursesLoading } = useSelector(
    (state) => state.course
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getStudentProfile());
    dispatch(getCourses());
  }, [dispatch]);

  if (profileLoading || coursesLoading) {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your academic progress and manage your courses.
            </Typography>
          </Paper>
        </Grid>

        {/* Academic Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Academic Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Current Semester: {profile?.currentSemester || 'N/A'}
              </Typography>
              <Typography variant="body1">
                GPA: {profile?.gpa?.toFixed(2) || 'N/A'}
              </Typography>
              <Typography variant="body1">
                Courses Enrolled: {profile?.courses?.length || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Goals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Goals
            </Typography>
            <Box sx={{ mt: 2 }}>
              {profile?.goals?.length > 0 ? (
                profile.goals.map((goal, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{goal.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {goal.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={
                        goal.status === 'completed'
                          ? 'success.main'
                          : goal.status === 'in-progress'
                          ? 'warning.main'
                          : 'text.secondary'
                      }
                    >
                      Status: {goal.status}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No goals set yet.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Courses */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Courses
            </Typography>
            <Grid container spacing={2}>
              {courses?.slice(0, 3).map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Paper
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="subtitle1">{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.courseCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Credits: {course.credits}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 