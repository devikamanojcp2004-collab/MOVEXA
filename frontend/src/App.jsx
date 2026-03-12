import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/common/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkshopsPage from './pages/WorkshopsPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import ProfilePage from './pages/ProfilePage';
import DancerPage from './pages/DancerPage';
import UserPage from './pages/UserPage';
import UserDashboard from './pages/UserDashboard';
import DancerDashboard from './pages/DancerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// "/" → LandingPage if guest, role-based dashboard if admin, HomePage if other logged-in user
const SmartRoot = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return user ? <Navigate to="/home" replace /> : <LandingPage />;
};

const AppRoutes = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Routes>
        {/* Smart root */}
        <Route path="/" element={<SmartRoot />} />

        {/* Post-login home – admins are redirected to their dashboard */}
        <Route path="/home" element={<ProtectedRoute roles={['user', 'dancer']}><HomePage /></ProtectedRoute>} />

        {/* Auth pages (redirect away if already logged in) */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Profile (all roles) */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Public workshop pages */}
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetailPage />} />

        {/* Public profile pages */}
        <Route path="/dancer/:dancerId" element={<DancerPage />} />
        <Route path="/u/:userId" element={<UserPage />} />

        {/* Role Dashboards */}
        <Route path="/dashboard/user" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/dancer" element={<ProtectedRoute roles={['dancer']}><DancerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        {/* Redirect /dashboard → role-specific */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 pt-20">
            <div className="text-6xl">🕺</div>
            <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
            <p className="text-gray-400">This page doesn't exist.</p>
            <a href="/" className="text-maroon-600 font-semibold hover:underline">Go Home</a>
          </div>
        } />
      </Routes>
    </main>
    <Footer />
    <Toaster
      position="top-center"
      toastOptions={{
        className: 'font-medium',
        style: { borderRadius: '12px', fontSize: '14px' },
        success: { iconTheme: { primary: '#800000', secondary: '#fff' } },
      }}
    />
  </div>
);

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user?.role === 'dancer') return <Navigate to="/dashboard/dancer" replace />;
  return <Navigate to="/dashboard/user" replace />;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
