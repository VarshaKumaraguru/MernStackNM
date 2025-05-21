import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getStudentProfile } from '../../store/slices/studentSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(getStudentProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your courses and track your progress
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate('/courses')}
              >
                View My Courses
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate('/profile')}
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Profile Summary
            </Typography>
            {profile ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Student ID:</strong> {profile.studentId}
                </Typography>
                <Typography variant="body1">
                  <strong>Department:</strong> {profile.department}
                </Typography>
                <Typography variant="body1">
                  <strong>Semester:</strong> {profile.semester}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No profile information available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 