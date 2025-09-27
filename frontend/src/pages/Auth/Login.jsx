import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, FileText, Loader2, Lock, Mail } from 'lucide-react';  
import { validateEmail, validatePassword } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  
 // --- Validasi dan Logika Form ---
  const validate = () => {
    const errors = { email: "", password: "" };

    // Gunakan fungsi validateEmail yang diimpor
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Gunakan fungsi validatePassword yang diimpor
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setFieldErrors(errors);
    
    // Kembalikan true jika tidak ada error, false jika ada
    return !errors.email && !errors.password;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if(touched[name]) {
        validate();
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate();
  };

  const isFormValid = () => {
    return !fieldErrors.email && !fieldErrors.password && formData.email && formData.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();
    setTouched({ email: true, password: true });

    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData); 

      if (response.status === 200) {
        const { token } = response.data; 

        if (token) {
          setSuccess("Login successfull!"); 
          login(response.data, token); 

          // Redirect based on role 
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000); 
        }
      } else {
        setError(response.data.message || "Invalid credentials"); 
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("An error occured during login."); 
      }
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    // Container utama dengan latar belakang biru muda
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      
      {/* Kartu Login */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-block p-3 mb-4 text-white bg-blue-800 rounded-full">
            <FileText className='w-7 h-7' />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Login to your Account
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            Welcome back to Invoice Generator
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Input Email */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-gray-700'>
              Email
            </label>
            <div className="relative">
              <Mail className='absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2' />
              <input
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50 ${
                  fieldErrors.email && touched.email
                    ? "border-red-400 focus:ring-red-500" :
                    "border-gray-300 focus:ring-blue-500"
                }
                `}
                placeholder='Enter your email'
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className='text-xs text-red-500'>{fieldErrors.email}</p>
            )}
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className='absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2' />
              <input
                name='password'
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50 ${
                  fieldErrors.password && touched.password
                    ? "border-red-400 focus:ring-red-500" :
                    "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-400 transition-colors top-1/2 right-4 -translate-y-1/2 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) :
                  <Eye className='w-5 h-5' />
                }
              </button>
            </div>
              {fieldErrors.password && touched.password && (
                <p className='text-xs text-red-500'>{fieldErrors.password}</p>
              )}
          </div>

          {/* Pesan Error/Success */}
          {error && (
            <div className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-center text-green-700 bg-green-100 rounded-lg">
              <p>{success}</p>
            </div>
          )}

          {/* Tombol Sign In */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-800/30 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an Account? {" "}
            <button
              onClick={() => navigate('/sign-up')}
              className="font-semibold text-blue-800 transition-all hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;