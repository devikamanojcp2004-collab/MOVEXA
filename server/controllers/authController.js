const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

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

// @desc    Register
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

// @desc    Google OAuth – verify token, find or create user
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'ID token required' });
    try {
        // Verify Google ID token via Google's tokeninfo endpoint
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        const payload = await response.json();
        if (payload.error || !payload.email) {
            return res.status(401).json({ message: 'Invalid Google token' });
        }
        const user = await userRepository.findOrCreateGoogleUser({
            googleId: payload.sub,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0],
            avatar: payload.picture || '',
        });
        sendTokenCookie(user, 200, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, logout, getMe, updateProfile, googleAuth };
