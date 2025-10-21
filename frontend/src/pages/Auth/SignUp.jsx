import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, FileText, Check } from 'lucide-react';
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

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must not exceed 50 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const validate = () => {
    const errors = { name: "", email: "", password: "", confirmPassword: "" };
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    setFieldErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validate();
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

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, submitData);

      if (response.status === 201) {
        const { token, ...userData } = response.data;
        
        if (token) {
          login(userData, token);
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        } else {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.message || "Registration failed";
        setError(errorMessage);
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "AI-powered invoice generation",
    "Automated payment reminders",
    "Professional templates",
    "Real-time analytics"
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-slate-900 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm">
            <FileText className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start managing invoices professionally
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Join thousands of businesses using our platform to streamline their invoicing process.
          </p>
          
          {/* Features List */}
          <div className="space-y-4 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header - Mobile Only */}
          <div className="text-center lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-lg mb-6">
              <FileText className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Get started with your free account
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-900">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`block w-full px-4 py-3 bg-white border ${
                    fieldErrors.name && touched.name
                      ? 'border-slate-900'
                      : 'border-slate-200'
                  } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors`}
                  placeholder="John Doe"
                />
                {fieldErrors.name && touched.name && (
                  <p className="mt-2 text-xs text-slate-600">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`block w-full px-4 py-3 bg-white border ${
                    fieldErrors.email && touched.email
                      ? 'border-slate-900'
                      : 'border-slate-200'
                  } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors`}
                  placeholder="name@company.com"
                />
                {fieldErrors.email && touched.email && (
                  <p className="mt-2 text-xs text-slate-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full px-4 py-3 pr-12 bg-white border ${
                      fieldErrors.password && touched.password
                        ? 'border-slate-900'
                        : 'border-slate-200'
                    } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && touched.password && (
                  <p className="mt-2 text-xs text-slate-600">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`block w-full px-4 py-3 pr-12 bg-white border ${
                      fieldErrors.confirmPassword && touched.confirmPassword
                        ? 'border-slate-900'
                        : 'border-slate-200'
                    } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-2 text-xs text-slate-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-slate-600">
                I agree to the{' '}
                <button type="button" className="text-slate-900 hover:text-slate-700 transition-colors">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-slate-900 hover:text-slate-700 transition-colors">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="group relative w-full flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-slate-900 hover:text-slate-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;