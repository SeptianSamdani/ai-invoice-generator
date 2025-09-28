import { Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth(); 
    if (loading) {
        return <p>Loading...</p>
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />; 
    }
    return (
        <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
    )
}

export default ProtectedRoute
