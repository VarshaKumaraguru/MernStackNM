import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import courseReducer from './slices/courseSlice';
import teacherReducer from './slices/teacherSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    course: courseReducer,
    teacher: teacherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 