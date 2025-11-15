import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';

const SignIn: React.FC = () => {
  const [viewMode, setViewMode] = useState<'login' | 'businessType' | 'signup'>('login');
  const [businessType, setBusinessType] = useState<'small_business' | 'accounting_firm' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Signup form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

  const handleBusinessTypeSelect = (type: 'small_business' | 'accounting_firm') => {
    setBusinessType(type);
    setViewMode('signup');
    setError('');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement signup logic with Supabase
      console.log('Signup data:', { firstName, lastName, email, companyName, phone, referralCode, businessType });
      // For now, just navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setError('An error occurred during signup. Please try again.');
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      {/* Sign In Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {viewMode === 'login' && 'Welcome Back'}
              {viewMode === 'businessType' && 'Choose Your Business Type'}
              {viewMode === 'signup' && 'Start Your Free Trial'}
            </h1>
            {viewMode === 'businessType' && (
              <p className="text-sm text-gray-600">Select the option that best describes your business</p>
            )}
            {viewMode === 'signup' && (
              <p className="text-sm text-gray-600">14-day trial. No credit card required</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-[#F87171] mr-3 flex-shrink-0" />
              <p className="text-xs text-[#F87171]">{error}</p>
            </div>
          )}

          {/* Business Type Selection */}
          {viewMode === 'businessType' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleBusinessTypeSelect('small_business')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all duration-200 group text-left"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#8B5CF6] transition-colors">
                      Small Business
                    </h3>
                    <p className="text-sm text-gray-600">
                      Perfect for startups and growing businesses looking to manage their finances efficiently
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleBusinessTypeSelect('accounting_firm')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all duration-200 group text-left"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#8B5CF6] transition-colors">
                      Accounting Firm
                    </h3>
                    <p className="text-sm text-gray-600">
                      Designed for accounting professionals managing multiple client accounts
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Login Form */}
          {viewMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-3">
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
              <label className="block text-xs font-semibold text-gray-700 mb-3">
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
                <span className="ml-3 text-xs text-gray-600">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-[#3AB7BF] hover:text-[#2A9BA3] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#9333EA] border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-4"
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
          )}

          {/* Signup Form */}
          {viewMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your work email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  Referral Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter referral code if you have one"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 text-[#8B5CF6] border-gray-300 rounded focus:ring-[#8B5CF6] focus:ring-2 mt-1"
                  required
                />
                <label className="ml-3 text-xs text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#9333EA] border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 py-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Start Free Trial'
                )}
              </Button>
            </form>
          )}

          {/* Divider - Only show for login */}
          {viewMode === 'login' && (
            <>
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-500 bg-white rounded-full">or</span>
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
            </>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              {viewMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setViewMode('businessType');
                      setError('');
                    }}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-semibold transition-colors"
                  >
                    Get started for free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setViewMode('login');
                      setError('');
                    }}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-semibold transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <div className="w-3 h-3 bg-[#4ADE80] rounded-full mr-2"></div>
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;