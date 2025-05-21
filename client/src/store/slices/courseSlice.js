import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all courses
export const getCourses = createAsyncThunk(
  'course/getAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.get(`${API_URL}/courses`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get course by ID
export const getCourseById = createAsyncThunk(
  'course/getById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.get(`${API_URL}/courses/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Enroll in course
export const enrollInCourse = createAsyncThunk(
  'course/enroll',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/enroll`,
        {},
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create course
export const createCourse = createAsyncThunk(
  'course/create',
  async (courseData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.post(`${API_URL}/courses`, courseData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update student grade
export const updateStudentGrade = createAsyncThunk(
  'course/updateGrade',
  async ({ courseId, studentId, grade }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.put(
        `${API_URL}/courses/${courseId}/students/${studentId}/grade`,
        { grade },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add student to course
export const addStudentToCourse = createAsyncThunk(
  'course/addStudent',
  async ({ courseId, studentId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/students`,
        { studentId },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add comment to student
export const addStudentComment = createAsyncThunk(
  'course/addComment',
  async ({ courseId, studentId, comment }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/students/${studentId}/comments`,
        { comment },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update student comment
export const updateStudentComment = createAsyncThunk(
  'course/updateComment',
  async ({ courseId, studentId, commentId, comment }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.put(
        `${API_URL}/courses/${courseId}/students/${studentId}/comments/${commentId}`,
        { comment },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get student performance data
export const getStudentPerformance = createAsyncThunk(
  'course/getPerformance',
  async ({ courseId, studentId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          'x-auth-token': auth.token,
        },
      };
      const response = await axios.get(
        `${API_URL}/courses/${courseId}/students/${studentId}/performance`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  studentPerformance: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearStudentPerformance: (state) => {
      state.studentPerformance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Courses
      .addCase(getCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Course by ID
      .addCase(getCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Student Grade
      .addCase(updateStudentGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(updateStudentGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Add Student to Course
      .addCase(addStudentToCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentToCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(addStudentToCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Add Student Comment
      .addCase(addStudentComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentComment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(addStudentComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Student Comment
      .addCase(updateStudentComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentComment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(updateStudentComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Student Performance
      .addCase(getStudentPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentPerformance = action.payload;
      })
      .addCase(getStudentPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError, clearCurrentCourse, clearStudentPerformance } = courseSlice.actions;
export default courseSlice.reducer; 