const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workshop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workshop',
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed',
    },
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Prevent duplicate bookings
bookingSchema.index({ user: 1, workshop: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
