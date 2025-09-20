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
import ViewInvoice from './pages/Invoices/ViewInvoice';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
  return (
    <div>
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
            <Route path='invoices/create' element={<CreateInvoice />} />
            <Route path='invoices/:id' element={<ViewInvoice />} />
            <Route path='profile' element={<ProfilePage />} />
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{ 
          className: "", 
          style: {
            fontSize: "13px", 
          }, 
         }}
      />
    </div>
  )
}

export default App
