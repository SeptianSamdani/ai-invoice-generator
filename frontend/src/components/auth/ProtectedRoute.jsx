import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const ProtectedRoute = ({children}) => {
    const isAuthenticated = true; 
    const loading = false; 

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
