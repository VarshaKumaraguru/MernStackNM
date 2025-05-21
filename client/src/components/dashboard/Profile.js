import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getStudentProfile, updateStudentProfile } from '../../store/slices/studentSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.student);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentSemester: '',
    major: '',
    minor: '',
    goals: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(getStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        currentSemester: profile.currentSemester || '',
        major: profile.major || '',
        minor: profile.minor || '',
        goals: profile.goals || [],
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateStudentProfile(formData)).unwrap();
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Profile</Typography>
          <Button
            variant={isEditing ? 'outlined' : 'contained'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Semester"
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Minor"
                name="minor"
                value={formData.minor}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            {isEditing && (
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save Changes
                </Button>
              </Grid>
            )}
          </Grid>
        </form>

        {/* Goals Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Goals
          </Typography>
          {formData.goals.length > 0 ? (
            formData.goals.map((goal, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
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
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No goals set yet.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 