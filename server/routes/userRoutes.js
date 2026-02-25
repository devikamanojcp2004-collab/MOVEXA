const express = require('express');
const router = express.Router();
const path = require('path');
const userRepository = require('../repositories/userRepository');
const workshopRepository = require('../repositories/workshopRepository');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @desc    Upload profile avatar image
// @route   POST /api/users/upload-avatar
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Build the public URL for the uploaded file
        const serverBase = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
        const avatarUrl = `${serverBase}/uploads/${req.file.filename}`;

        const user = await userRepository.update(req.user._id, { avatar: avatarUrl });
        res.json({ avatarUrl, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all public dancer profiles
// @route   GET /api/users/dancers
router.get('/dancers', async (req, res) => {
    try {
        const dancers = await userRepository.findAllDancers();
        res.json(dancers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get public user/dancer profile by ID
// @route   GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await userRepository.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let workshops = [];
        if (user.role === 'dancer') {
            workshops = await workshopRepository.findByInstructorPublic(req.params.id);
        }

        res.json({ user, workshops });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

