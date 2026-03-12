const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        // Not required for Google-authenticated users
    },
    role: {
        type: String,
        enum: ['user', 'dancer', 'admin'],
        default: 'user',
    },
    isApproved: {
        type: Boolean,
        default: true, // overridden to false for dancers in pre-save
    },
    bio: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    googleId: {
        type: String,
        default: '',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

// Auto-set isApproved: dancers start unapproved, everyone else is approved
userSchema.pre('save', async function () {
    // Set approval status when role is first assigned
    if (this.isModified('role')) {
        this.isApproved = this.role !== 'dancer';
    }
    // Hash password if modified and present
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password (safe-guard for Google-only accounts)
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
