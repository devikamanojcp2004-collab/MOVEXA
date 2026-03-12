const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const userRepository = require('../repositories/userRepository');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: create token, set HTTP-only cookie, send response
const sendTokenCookie = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.COOKIE_EXPIRE || 7}d`,
    });

    const cookieOptions = {
        httpOnly: true,                    // Not accessible by JS
        sameSite: 'strict',
        maxAge: (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    };

    res.cookie('token', token, cookieOptions);

    // Never include password in response
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        avatar: user.avatar,
        bio: user.bio,
    };

    res.status(statusCode).json({ user: userData });
};

// @desc    Register (legacy – kept for backward-compat, not used by the OTP flow)
// @route   POST /api/auth/register
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const allowedRole = ['user', 'dancer'].includes(role) ? role : 'user';
        const user = await userRepository.create({ name, email, password, role: allowedRole });
        sendTokenCookie(user, 201, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── OTP-based Registration ──────────────────────────────────────────────────

// @desc    Step 1 – validate details, generate & email OTP
// @route   POST /api/auth/send-otp
const sendOtp = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Block if email already registered
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate a 6-digit OTP
        const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(plainOtp, 10);

        // Upsert: remove any existing OTP for this email, then save a fresh one
        await Otp.deleteMany({ email: email.toLowerCase() });
        await Otp.create({
            email: email.toLowerCase(),
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            name,
            password,   // stored plain – will be hashed by User pre-save hook
            role: ['user', 'dancer'].includes(role) ? role : 'user',
        });

        // Email the OTP
        await sendOtpEmail(email, plainOtp, name);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('sendOtp error:', error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

// @desc    Step 2 – verify OTP and create the user account
// @route   POST /api/auth/verify-otp
const verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const record = await Otp.findOne({ email: email.toLowerCase() });
        if (!record) {
            return res.status(400).json({ message: 'OTP expired or not found. Please request a new code.' });
        }

        const isMatch = await record.verifyOtp(otp);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid OTP. Please check the code and try again.' });
        }

        // Double-check email isn't taken (edge case: registered while OTP was pending)
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            await Otp.deleteMany({ email: email.toLowerCase() });
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create the user using the data stored in the OTP record
        const user = await userRepository.create({
            name: record.name,
            email: record.email,
            password: record.password,
            role: record.role,
        });

        // Clean up OTP record
        await Otp.deleteMany({ email: email.toLowerCase() });

        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        }

        sendTokenCookie(user, 201, res);
    } catch (error) {
        console.error('verifyOtpAndRegister error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await userRepository.findByEmail(email);
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        }
        sendTokenCookie(user, 200, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout – clear cookie
// @route   POST /api/auth/logout
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(0), // immediately expire
    });
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    const user = await userRepository.findById(req.user._id);
    res.json(user);
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await userRepository.findByIdWithPassword(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
        user.phone = req.body.phone || user.phone;

        if (req.body.password && req.body.password.length >= 6) {
            user.password = req.body.password;
        }

        const updated = await user.save();
        sendTokenCookie(updated, 200, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google OAuth – verify credential token, find or create user
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
    const { credential, role } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential required' });
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const allowedRole = ['user', 'dancer'].includes(role) ? role : 'user';
        const user = await userRepository.findOrCreateGoogleUser({
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            avatar: payload.picture || '',
            role: allowedRole,
        });
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
        }
        sendTokenCookie(user, 200, res);
    } catch (error) {
        console.error('Google auth error:', error.message);
        res.status(401).json({ message: 'Invalid Google credential', detail: error.message });
    }
};

module.exports = { register, login, logout, getMe, updateProfile, googleAuth, sendOtp, verifyOtpAndRegister };
