const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    // Stored as a bcrypt hash for security
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        // MongoDB TTL: automatically deletes document after expiry
        index: { expireAfterSeconds: 0 },
    },
    // Store form data so step-2 doesn't need to re-send it from the client
    name: { type: String, required: true },
    password: { type: String, required: true }, // plain – hashed when User is created
    role: { type: String, default: 'user' },
});

// Compare a plain OTP against the stored hash
otpSchema.methods.verifyOtp = async function (plainOtp) {
    return bcrypt.compare(plainOtp, this.otp);
};

module.exports = mongoose.model('Otp', otpSchema);
