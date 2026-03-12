const userRepository = require('../repositories/userRepository');
const workshopRepository = require('../repositories/workshopRepository');
const bookingRepository = require('../repositories/bookingRepository');

// @desc    Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'dancer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await userRepository.update(req.params.id, { role });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Soft-delete user (marks isDeleted:true, keeps data in DB)
const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        await userRepository.softDelete(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Platform statistics
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalDancers, totalAdmins, totalWorkshops, pendingWorkshops, approvedWorkshops, totalBookings, pendingDancers] = await Promise.all([
            userRepository.countByRole('user'),
            userRepository.countByRole('dancer'),
            userRepository.countByRole('admin'),
            workshopRepository.countAll(),
            workshopRepository.countByStatus('pending'),
            workshopRepository.countByStatus('approved'),
            bookingRepository.countConfirmed(),
            userRepository.findPendingDancers().then(d => d.length),
        ]);
        res.json({ totalUsers, totalDancers, totalAdmins, totalWorkshops, pendingWorkshops, approvedWorkshops, totalBookings, pendingDancers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unapproved dancer accounts
const getPendingDancers = async (req, res) => {
    try {
        const dancers = await userRepository.findPendingDancers();
        res.json(dancers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a dancer account
const approveDancer = async (req, res) => {
    try {
        const dancer = await userRepository.approveDancer(req.params.id);
        if (!dancer) return res.status(404).json({ message: 'Dancer not found' });
        res.json({ message: 'Dancer approved!', dancer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getStats, getPendingDancers, approveDancer };

