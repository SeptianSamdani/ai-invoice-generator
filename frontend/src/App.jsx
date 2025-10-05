import {
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/Auth/SignUp'; 
import Login from './pages/Auth/Login'; 
import ProfilePage from './pages/Profile/ProfilePage';
import Dashboard from './pages/Dashboard/Dashboard';
import Invoices from './pages/Invoices/Invoices';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import EditInvoice from './pages/Invoices/EditInvoice';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import InvoiceDetail from './pages/Invoices/InvoiceDetail';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/login' element={<Login />} />

          {/* Protected Route */}
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='invoices' element={<Invoices />} />
            <Route path='invoices/new' element={<CreateInvoice />} />
            {/* Edit Invoice - Component terpisah */}
            <Route path='invoices/edit/:id' element={<EditInvoice />} />
            {/* View Invoice Detail */}
            <Route path='invoices/view/:id' element={<InvoiceDetail />} />
            <Route path='profile' element={<ProfilePage />} />
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{ 
          className: "", 
          style: {
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App