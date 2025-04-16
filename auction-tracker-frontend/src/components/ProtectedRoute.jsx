import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireEmailVerified = false }) {
    const { isAuthenticated, isEmailVerified } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requireEmailVerified && !isEmailVerified) {
        return <Navigate to="/verify-notice" />;
    }

    return children;
}

export default ProtectedRoute;