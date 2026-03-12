import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import DancerLogo from '../components/common/DancerLogo';
import { GoogleLogin } from '@react-oauth/google';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const user = await googleLogin(credentialResponse.credential);
            toast.success(`Welcome, ${user.name}!`);
            if (user.role === 'admin') navigate('/dashboard/admin');
            else if (user.role === 'dancer') navigate('/dashboard/dancer');
            else navigate('/dashboard/user');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google sign-in failed. Try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === 'admin') navigate('/dashboard/admin');
            else if (user.role === 'dancer') navigate('/dashboard/dancer');
            else navigate('/dashboard/user');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black pt-16 px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-maroon-900/30 blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-gray-950 border border-maroon-800/40 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <DancerLogo className="w-8 h-8 text-maroon-500" />
                            <span className="text-2xl font-bold tracking-tighter text-white">MOVEXA</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
                        <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="new-email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-maroon-900/50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mt-6 mb-4">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="text-xs text-gray-500 font-medium">OR CONTINUE WITH</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Google Sign-In */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google sign-in failed. Try again.')}
                            theme="filled_black"
                            shape="rectangular"
                            size="large"
                            width="368"
                            text="signin_with"
                        />
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-maroon-400 hover:text-maroon-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
