import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const getTeacherProfile = createAsyncThunk(
  'teacher/getTeacherProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/teachers/profile');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTeacherProfile = createAsyncThunk(
  'teacher/updateTeacherProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axios.put('/api/teachers/profile', profileData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTeacherCourses = createAsyncThunk(
  'teacher/getTeacherCourses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/teachers/courses');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  profile: null,
  courses: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Teacher Profile
      .addCase(getTeacherProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Teacher Profile
      .addCase(updateTeacherProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Teacher Courses
      .addCase(getTeacherCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = teacherSlice.actions;

export default teacherSlice.reducer; 