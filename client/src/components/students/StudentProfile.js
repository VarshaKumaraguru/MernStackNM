import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { getStudentProfile } from '../../store/slices/studentSlice';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.student);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getStudentProfile());
  }, [dispatch]);

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={profile?.email || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Student ID"
                  secondary={profile?.studentId || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Date of Birth"
                  secondary={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Gender"
                  secondary={profile?.gender || 'N/A'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Academic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Academic Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Current Semester"
                  secondary={profile?.currentSemester || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="GPA"
                  secondary={profile?.gpa?.toFixed(2) || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Major"
                  secondary={profile?.major || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Minor"
                  secondary={profile?.minor || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Enrollment Date"
                  secondary={profile?.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : 'N/A'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Phone"
                  secondary={profile?.contactNumber || 'N/A'}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={
                    profile?.address
                      ? `${profile.address.street || ''}, ${profile.address.city || ''}, ${profile.address.state || ''}, ${profile.address.zipCode || ''}, ${profile.address.country || ''}`
                      : 'N/A'
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Current Courses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Current Courses
            </Typography>
            {profile?.courses?.length > 0 ? (
              <List>
                {profile.courses.map((course, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={course.course?.title || 'N/A'}
                        secondary={`Grade: ${course.grade || 'Not Graded'}`}
                      />
                    </ListItem>
                    {index < profile.courses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No courses enrolled
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentProfile; 