import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Music2, Users, ArrowLeft, RotateCcw, ShieldCheck } from 'lucide-react';
import DancerLogo from '../components/common/DancerLogo';
import { GoogleLogin } from '@react-oauth/google';
import api from '../lib/axios';

// ─── OTP Input Component ─────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
    const inputsRef = useRef([]);
    const digits = value.split('');

    const handleChange = (i, e) => {
        const val = e.target.value.replace(/\D/, '');
        if (!val) return;
        const next = [...digits];
        next[i] = val[val.length - 1]; // take only the last digit typed
        onChange(next.join(''));
        if (i < 5) inputsRef.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace') {
            const next = [...digits];
            if (next[i]) {
                next[i] = '';
                onChange(next.join(''));
            } else if (i > 0) {
                inputsRef.current[i - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            onChange(pasted);
            inputsRef.current[5]?.focus();
        }
        e.preventDefault();
    };

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputsRef.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-900 border-2 rounded-xl text-white 
                               focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 
                               transition-all caret-transparent"
                    style={{ borderColor: digits[i] ? '#7f0000' : '#374151' }}
                />
            ))}
        </div>
    );
};

// ─── Main RegisterPage ────────────────────────────────────────────────────────
const RegisterPage = () => {
    // Step 1 fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [role, setRole] = useState('user');

    // Step state
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Step 2 OTP
    const [otp, setOtp] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const { googleLogin, refreshUser } = useAuth();
    const navigate = useNavigate();

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    // ── Google OAuth (bypasses OTP) ───────────────────────────────────────────
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const user = await googleLogin(credentialResponse.credential, role);
            toast.success(`Welcome aboard, ${user.name}!`);
            navigate(user.role === 'dancer' ? '/dashboard/dancer' : '/dashboard/user');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google sign-in failed. Try again.');
        }
    };

    // ── Step 1: send OTP ─────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { name, email, password, role });
            toast.success('Verification code sent! Check your inbox.');
            setStep(2);
            setCooldown(60);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { name, email, password, role });
            toast.success('New code sent!');
            setCooldown(60);
            setOtp('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: verify OTP and create account ─────────────────────────────────
    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length < 6) { toast.error('Please enter the full 6-digit code'); return; }
        setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            // Cookie is now set by the server — hydrate AuthContext
            const user = await refreshUser();
            toast.success(`Welcome to MOVEXA, ${user?.name || name}! 🕺`);
            navigate(user?.role === 'dancer' ? '/dashboard/dancer' : '/dashboard/user');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-black pt-16 px-4 py-12">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-maroon-900/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-gray-950 border border-maroon-800/40 rounded-2xl p-8 shadow-2xl">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <DancerLogo className="w-8 h-8 text-maroon-500" />
                            <span className="text-2xl font-bold tracking-tighter text-white">MOVEXA</span>
                        </div>
                        {step === 1 ? (
                            <>
                                <h1 className="text-2xl font-bold text-white mt-4">Create an account</h1>
                                <p className="text-gray-400 text-sm mt-1">Join thousands of dancers</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-white mt-4">Verify your email</h1>
                                <p className="text-gray-400 text-sm mt-1 text-center">
                                    We sent a 6-digit code to<br />
                                    <span className="text-maroon-400 font-medium">{email}</span>
                                </p>
                            </>
                        )}
                    </div>

                    {/* ── Step 1: registration form ── */}
                    {step === 1 && (
                        <>
                            {/* Role Toggle */}
                            <div className="flex gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setRole('user')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${role === 'user'
                                        ? 'bg-maroon-800 border-maroon-600 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                                        }`}
                                >
                                    <Users className="w-4 h-4" />
                                    I'm a Learner
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('dancer')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${role === 'dancer'
                                        ? 'bg-maroon-800 border-maroon-600 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                                        }`}
                                >
                                    <Music2 className="w-4 h-4" />
                                    I'm a Dancer
                                </button>
                            </div>

                            <form onSubmit={handleSendOtp} className="space-y-4" autoComplete="off">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                            autoComplete="new-name"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 transition-colors"
                                            placeholder="Your full name" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                            autoComplete="new-email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 transition-colors"
                                            placeholder="you@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                            autoComplete="new-password"
                                            className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 transition-colors"
                                            placeholder="Min. 6 characters" />
                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-maroon-900/50 disabled:opacity-60 mt-2">
                                    {loading ? 'Sending code...' : `Continue as ${role === 'user' ? 'Learner' : 'Dancer'}`}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3 mt-4 mb-4">
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
                                    text="signup_with"
                                />
                            </div>

                            <p className="text-center text-gray-400 text-sm mt-6">
                                Already have an account?{' '}
                                <Link to="/login" className="text-maroon-400 hover:text-maroon-300 font-medium transition-colors">Sign in</Link>
                            </p>
                        </>
                    )}

                    {/* ── Step 2: OTP entry ── */}
                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-6">
                            {/* Shield icon */}
                            <div className="flex justify-center">
                                <div className="w-16 h-16 rounded-full bg-maroon-900/30 border border-maroon-800/50 flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-maroon-400" />
                                </div>
                            </div>

                            {/* OTP digits */}
                            <OtpInput value={otp} onChange={setOtp} />

                            {/* Verify button */}
                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full py-3 bg-maroon-700 hover:bg-maroon-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-maroon-900/50 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify & Create Account'}
                            </button>

                            {/* Resend */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={cooldown > 0 || loading}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed"
                                    style={{ color: cooldown > 0 ? '#6b7280' : '#f87171' }}
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                                </button>
                            </div>

                            {/* Back link */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtp(''); }}
                                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Change email / details
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
