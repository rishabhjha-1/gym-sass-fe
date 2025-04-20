import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import EditCustomer from './pages/EditCustomer';
import Revenue from './pages/Revenue';
import Attendance from './pages/Attendance';
import Staff from './pages/Staff';
import Fees from './pages/Fees';
// import Ledger from './pages/Ledger';
import AIContent from './pages/AIContent';
// import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AllCheckIns from './pages/AllCheckIns';
import Profile from './pages/Profile';

// Auth Provider
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Auth Route Component (for login/register pages)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

import Navigation from './components/layout/Navigation';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />
      </Route>

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          {/* <Navigation /> */}
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/customers/:id/edit" element={<EditCustomer />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/all" element={<AllCheckIns />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/fees" element={<Fees />} />
        {/* <Route path="/ledger" element={<Ledger />} /> */}
        <Route path="/ai-content" element={<AIContent />} />
        <Route path="/settings" element={<Profile />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
};

export default App;