import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTeacherProfile } from '../../store/slices/teacherSlice';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector((state) => state.teacher);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTeacherProfile());
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
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your courses and track student progress.
            </Typography>
          </Paper>
        </Grid>

        {/* Teaching Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Teaching Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Active Courses"
                  secondary={profile?.courses?.filter(c => c.status === 'active').length || 0}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Total Students"
                  secondary={profile?.courses?.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0) || 0}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Department"
                  secondary={profile?.department || 'N/A'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/courses/create')}
              >
                Create New Course
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/courses/manage')}
              >
                Manage Courses
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/students/manage')}
              >
                Manage Students
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Current Courses */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Courses
            </Typography>
            {profile?.courses?.length > 0 ? (
              <List>
                {profile.courses.map((course, index) => (
                  <React.Fragment key={course._id}>
                    <ListItem>
                      <ListItemText
                        primary={course.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {course.courseCode} - {course.schedule?.day} {course.schedule?.startTime} - {course.schedule?.endTime}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              Enrolled: {course.enrolledStudents?.length}/{course.capacity} students
                            </Typography>
                          </>
                        }
                      />
                      <Button
                        size="small"
                        onClick={() => navigate(`/courses/${course._id}/manage`)}
                      >
                        Manage
                      </Button>
                    </ListItem>
                    {index < profile.courses.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No courses assigned
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {profile?.recentActivities?.length > 0 ? (
              <List>
                {profile.recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {activity.course}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {new Date(activity.date).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < profile.recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No recent activities
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 