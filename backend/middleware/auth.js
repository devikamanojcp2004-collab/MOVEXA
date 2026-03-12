const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// Protect routes – read JWT from HTTP-only cookie (with header fallback)
const protect = async (req, res, next) => {
    let token = req.cookies?.token;

    // Fallback: Authorization header (for Postman / API clients)
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized – no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userRepository.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized – invalid token' });
    }
};

// Role-based authorization factory
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
