import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import * as authService from '../services/authService';
import { ensureUserProfile, updateUserName } from '../services/userService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showGoogleNameModal, setShowGoogleNameModal] = useState(false);
    const [googleNameInput, setGoogleNameInput] = useState('');
    const [googleUserData, setGoogleUserData] = useState<any>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isSignup) {
                if (!name.trim()) {
                    setError('Name is required');
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                const newUser = await authService.registerWithEmail(email, password);
                if (newUser) {
                    await ensureUserProfile(newUser);
                }
            } else {
                await authService.loginWithEmail(email, password);
            }
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            const user = await authService.loginWithGoogle();
            if (user) {
                // ensure profile created by service already, but we still prompt for name if missing
                if (!user.displayName) {
                    setGoogleUserData(user);
                    setGoogleNameInput('');
                    setShowGoogleNameModal(true);
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Google sign-in failed');
        }
    };

    const handleGoogleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!googleNameInput.trim()) {
            setError('Name is required');
            return;
        }
        try {
            if (googleUserData) {
                await updateUserName(googleUserData.uid, googleNameInput.trim());
            }
            setShowGoogleNameModal(false);
            setGoogleUserData(null);
            setGoogleNameInput('');
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('Failed to save name');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mint-50 via-sky-50 to-white">
            <Card className="max-w-md w-full shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">
                    {isSignup ? 'Create an account' : 'Sign in to your account'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <div className="flex items-center border rounded-lg px-3 py-2">
                            <User className="w-5 h-5 text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                placeholder="Full Name"
                                className="w-full outline-none"
                            />
                        </div>
                    )}
                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Mail className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                            className="w-full outline-none"
                        />
                    </div>

                    <div className="flex items-center border rounded-lg px-3 py-2">
                        <Lock className="w-5 h-5 text-gray-500 mr-2" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            className="w-full outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                                {isSignup && (
                                    <div className="flex items-center border rounded-lg px-3 py-2">
                                        <Lock className="w-5 h-5 text-gray-500 mr-2" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="Re-enter Password"
                                            className="w-full outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button type="submit" className="w-full" variant="primary">
                        {isSignup ? 'Sign up' : 'Sign in'}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGoogle}
                        className="w-full mt-2 flex items-center justify-center gap-2"
                        variant="secondary"
                    >
                        Continue with Google
                    </Button>
                </form>

                {/* Google Name Modal */}
                {showGoogleNameModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <Card className="max-w-md w-full shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Complete Your Profile</h3>
                            <p className="text-gray-600 mb-6">Please enter your name to continue</p>
                            <form onSubmit={handleGoogleNameSubmit} className="space-y-4">
                                <div className="flex items-center border rounded-lg px-3 py-2">
                                    <User className="w-5 h-5 text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        value={googleNameInput}
                                        onChange={e => setGoogleNameInput(e.target.value)}
                                        autoFocus
                                        placeholder="Full Name"
                                        className="w-full outline-none"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-gradient-to-r from-mint-500 to-mint-600 text-white rounded-lg font-semibold hover:shadow-softLg transition-all"
                                >
                                    Continue
                                </button>
                            </form>
                        </Card>
                    </div>
                )}

                <p className="text-center text-sm mt-4">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        type="button"
                        className="text-mint-600 font-semibold underline"
                        onClick={() => setIsSignup(prev => !prev)}
                    >
                        {isSignup ? 'Sign in' : 'Sign up'}
                    </button>
                </p>
            </Card>
        </div>
    );
}
