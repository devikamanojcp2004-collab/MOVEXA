import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * ProtectedRoute – redirects to /login if not authenticated or wrong role.
 * If `roles` is provided, also checks the user's role.
 */
export const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
        if (user.role === 'dancer') return <Navigate to="/dashboard/dancer" replace />;
        return <Navigate to="/dashboard/user" replace />;
    }
    return children;
};

/**
 * GuestRoute – redirects logged-in users away from login/register pages.
 */
export const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (user) {
        if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
        if (user.role === 'dancer') return <Navigate to="/dashboard/dancer" replace />;
        return <Navigate to="/dashboard/user" replace />;
    }
    return children;
};

export default ProtectedRoute;
