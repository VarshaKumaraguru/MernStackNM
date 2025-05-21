import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getStudentPerformance,
  updateStudentGrade,
  addStudentComment,
  updateStudentComment,
} from '../../store/slices/courseSlice';

const StudentPerformance = ({ courseId, studentId }) => {
  const dispatch = useDispatch();
  const { currentCourse, studentPerformance, loading, error } = useSelector(
    (state) => state.course
  );

  const [grade, setGrade] = useState('');
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    dispatch(getStudentPerformance({ courseId, studentId }));
  }, [dispatch, courseId, studentId]);

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    dispatch(updateStudentGrade({ courseId, studentId, grade: Number(grade) }));
    setGrade('');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (editingCommentId) {
      dispatch(
        updateStudentComment({
          courseId,
          studentId,
          commentId: editingCommentId,
          comment,
        })
      );
      setEditingCommentId(null);
    } else {
      dispatch(addStudentComment({ courseId, studentId, comment }));
    }
    setComment('');
  };

  const handleEditComment = (commentId, currentComment) => {
    setEditingCommentId(commentId);
    setComment(currentComment);
  };

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
      <Grid container spacing={3}>
        {/* Performance Graph */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Over Time
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={studentPerformance?.grades || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke="#8884d8"
                    name="Grade"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Grade Management */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Grade
            </Typography>
            <form onSubmit={handleGradeSubmit}>
              <TextField
                fullWidth
                label="Grade"
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                inputProps={{ min: 0, max: 100 }}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Grade
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Comments Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                label="Add Comment"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {editingCommentId ? 'Update Comment' : 'Add Comment'}
              </Button>
            </form>

            <Box mt={3}>
              {studentPerformance?.comments?.map((comment) => (
                <Card key={comment._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{comment.text}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.date).toLocaleDateString()}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleEditComment(comment._id, comment.text)}
                      sx={{ ml: 2 }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentPerformance; 