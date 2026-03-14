import { Eye, EyeOff, Heart, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as authService from '../services/authService';
import { ensureUserProfile, updateUserName } from '../services/userService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleNameModal, setShowGoogleNameModal] = useState(false);
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googleUserData, setGoogleUserData] = useState<any>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        // FIX: pass name as third argument so it gets saved to Firestore
        await authService.registerWithEmail(email, password, name.trim());
      } else {
        await authService.loginWithEmail(email, password);
      }
      showToast(isSignup ? 'Account created. Welcome!' : 'Signed in successfully.');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : err.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      // FIX: correctly destructure { user } from return value
      const result = await authService.loginWithGoogle();
      const googleUser = result?.user;
      if (googleUser) {
        if (!googleUser.displayName) {
          setGoogleUserData(googleUser);
          setGoogleNameInput('');
          setShowGoogleNameModal(true);
        } else {
          showToast('Signed in with Google.');
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleNameInput.trim()) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    try {
      if (googleUserData) {
        await updateUserName(googleUserData.uid, googleNameInput.trim());
        await ensureUserProfile(googleUserData, googleNameInput.trim());
      }
      setShowGoogleNameModal(false);
      setGoogleUserData(null);
      setGoogleNameInput('');
      showToast('Profile updated. Welcome!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Failed to save name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus-within:ring-2 focus-within:ring-mint-400 focus-within:border-transparent transition-all duration-200';
  const inputField = 'flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint-50 via-sky-50 to-lavender-50" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-mint-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="relative w-full max-w-md mx-4 animate-slideUp">
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-softXl border border-white/80 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-mint-400 to-sky-400 shadow-softLg mb-3">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">
              MindScan+
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your mental wellbeing companion</p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsSignup(false); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !isSignup ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignup(true); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isSignup ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <div className={inputBase}>
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className={inputField}
                />
              </div>
            )}

            <div className={inputBase}>
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className={inputField}
              />
            </div>

            <div className={inputBase}>
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Password"
                className={inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isSignup && (
              <div className={inputBase}>
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm Password"
                  className={inputField}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isSignup ? 'Creating Account…' : 'Signing In…'}
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-mint-300 hover:bg-mint-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <span className="text-mint-600 font-medium cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-mint-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-mint-600 font-semibold hover:text-mint-700 transition-colors"
            onClick={() => { setIsSignup(prev => !prev); setError(''); }}
          >
            {isSignup ? 'Sign in' : 'Sign up for free'}
          </button>
        </p>
      </div>

      {/* Google Name Modal */}
      {showGoogleNameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-softXl animate-slideUp">
            <div className="flex flex-col items-center mb-6">
              <div className="text-4xl mb-3">👋</div>
              <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
              <p className="text-gray-500 text-sm text-center mt-1">What should we call you?</p>
            </div>
            <form onSubmit={handleGoogleNameSubmit} className="space-y-4">
              <div className={inputBase}>
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={e => setGoogleNameInput(e.target.value)}
                  autoFocus
                  placeholder="Your name"
                  className={inputField}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-mint-500 to-sky-500 text-white font-semibold hover:shadow-softLg transition-all disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Continue →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
