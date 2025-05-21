import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { loadUser } from './store/slices/authSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';

// Public Components
import NotFound from './components/NotFound';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Private Route Component
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && user.role && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard'} />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Function to determine redirect path based on user role
  const getRedirectPath = (user) => {
    if (!user) return '/login';
    return user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  loading ? (
                    <div>Loading...</div>
                  ) : isAuthenticated && user ? (
                    <Navigate to={getRedirectPath(user)} />
                  ) : (
                    <Navigate to="/login" />
                  )
                } 
              />
              <Route 
                path="/login" 
                element={
                  loading ? (
                    <div>Loading...</div>
                  ) : isAuthenticated && user ? (
                    <Navigate to={getRedirectPath(user)} />
                  ) : (
                    <Login />
                  )
                } 
              />
              <Route 
                path="/register" 
                element={
                  loading ? (
                    <div>Loading...</div>
                  ) : isAuthenticated && user ? (
                    <Navigate to={getRedirectPath(user)} />
                  ) : (
                    <Register />
                  )
                } 
              />

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute roles={['student']}>
                    <StudentDashboard />
                  </PrivateRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <PrivateRoute roles={['teacher']}>
                    <TeacherDashboard />
                  </PrivateRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
