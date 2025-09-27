import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, FileText, Loader2, Lock, Mail, User } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
  }); 

  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 
  const [fieldErrors, setFieldErrors] = useState({
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
  }); 

  const [touched, setTouched] = useState({
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false,
  }); 

  // --- Validation functions ---
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (name.trim().length > 50) {
      return "Name must not exceed 50 characters";
    }
    return "";
  }; 

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  }; 

  // --- Validasi dan Logika Form ---
  const validate = () => {
    const errors = { name: "", email: "", password: "", confirmPassword: "" };

    // Validasi name
    const nameError = validateName(formData.name);
    if (nameError) {
      errors.name = nameError;
    }

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

    // Validasi confirm password
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }

    setFieldErrors(errors);
    
    // Kembalikan true jika tidak ada error, false jika ada
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
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
    return !fieldErrors.name && !fieldErrors.email && !fieldErrors.password && !fieldErrors.confirmPassword && 
           formData.name && formData.email && formData.password && formData.confirmPassword;
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { confirmPassword, ...submitData } = formData; // Remove confirmPassword from submission
      
      console.log('Submitting registration data:', submitData); // Debug log
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, submitData); 
      
      console.log('Registration response:', response); // Debug log

      if (response.status === 201 && response.data.success) {
        const userData = response.data.data;
        const { token } = userData; 
        
        if (token) {
          setSuccess("Account created successfully! Auto-logging you in..."); 
          
          // Auto login user after successful signup
          login(userData, token); 
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000); 
        } else {
          setSuccess("Account created successfully! Redirecting to login..."); 
          setTimeout(() => {
            navigate('/login');
          }, 2000); 
        }
      } else {
        setError(response.data.message || "Registration failed"); 
      }
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || "Registration failed";
        setError(errorMessage);
        console.error('Server error response:', err.response.data);
      } else if (err.request) {
        // Request made but no response received
        setError("Network error. Please check your connection.");
        console.error('Network error:', err.request);
      } else {
        // Something else happened
        setError("An unexpected error occurred.");
        console.error('Unexpected error:', err.message);
      }
    } finally {
      setIsLoading(false); 
    }
  }; 

  return (
    // Container utama dengan latar belakang biru muda
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
      
      {/* Kartu SignUp */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-block p-3 mb-4 text-white bg-blue-800 rounded-full">
            <FileText className='w-7 h-7' />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create your Account
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            Join Invoice Generator today
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Input Name */}
          <div className="space-y-2">
            <label className='text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <div className="relative">
              <User className='absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2' />
              <input
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50 ${
                  fieldErrors.name && touched.name
                    ? "border-red-400 focus:ring-red-500" :
                    "border-gray-300 focus:ring-blue-500"
                }
                `}
                placeholder='Enter your full name'
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className='text-xs text-red-500'>{fieldErrors.name}</p>
            )}
          </div>

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
                placeholder='Create a password'
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

          {/* Input Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className='absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2' />
              <input
                name='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50 ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-400 focus:ring-red-500" :
                    "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder='Confirm your password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-gray-400 transition-colors top-1/2 right-4 -translate-y-1/2 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) :
                  <Eye className='w-5 h-5' />
                }
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className='text-xs text-red-500'>{fieldErrors.confirmPassword}</p>
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

          {/* Tombol Sign Up */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-800/30 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' />
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an Account? {" "}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-blue-800 transition-all hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp