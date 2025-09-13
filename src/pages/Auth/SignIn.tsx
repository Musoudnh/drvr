import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBooksLogin = () => {
    // In a real app, this would initiate QuickBooks OAuth flow
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E8F4F8] to-[#D1E7DD] flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3AB7BF]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4ADE80]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sign In Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1E2A38] mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your FinanceFlow account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-[#F87171] mr-3 flex-shrink-0" />
              <p className="text-sm text-[#F87171]">{error}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF] focus:ring-2" 
                />
                <span className="ml-3 text-sm text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#3AB7BF] hover:text-[#2A9BA3] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] hover:from-[#2A9BA3] hover:to-[#3BC66F] border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white rounded-full">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* QuickBooks Login */}
          <button
            onClick={handleQuickBooksLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-[#0077C5] hover:bg-[#0077C5]/5 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 mr-3 bg-[#0077C5] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">QB</span>
            </div>
            <span className="group-hover:text-[#0077C5] transition-colors">
              {isLoading ? 'Connecting...' : 'Continue with QuickBooks'}
            </span>
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/setup" 
                className="text-[#3AB7BF] hover:text-[#2A9BA3] font-semibold transition-colors"
              >
                Get started for free
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <div className="w-3 h-3 bg-[#4ADE80] rounded-full mr-2"></div>
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default SignIn;