import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/index';
import VolunteerDashboard from './pages/volunteer/index';
import AdminDashboard from './pages/admin/index';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import './styles/global.css';

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'volunteer') return <Navigate to="/volunteer" />;
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/volunteer" element={
              <ProtectedRoute roles={['volunteer']}>
                <VolunteerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <ToastContainer
            position="top-center"
            theme="dark"
            toastStyle={{ background: '#1a1f3a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;