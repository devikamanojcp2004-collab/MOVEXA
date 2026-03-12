const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Workshop title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    style: {
        type: String,
        required: [true, 'Dance style is required'],
        enum: ['Hip Hop', 'Ballet', 'Contemporary', 'Salsa', 'Bollywood', 'Kathak', 'Jazz', 'Freestyle', 'Popping & Locking', 'Bharatanatyam', 'Other'],
    },
    date: {
        type: Date,
        required: [true, 'Workshop date is required'],
    },
    time: {
        type: String,
        required: [true, 'Workshop time is required'],
    },
    duration: {
        type: String,
        default: '1 hour',
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: 1,
    },
    image: {
        type: String,
        default: '/workshop-default.jpg',
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels',
    },
    bookingsCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
