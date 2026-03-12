const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAllUsers, updateUserRole, deleteUser, getStats, getPendingDancers, approveDancer, toggleBlockStatus, getAllDancers, rejectDancer } = require('../controllers/adminController');

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/block', toggleBlockStatus);
router.delete('/users/:id', deleteUser);

// Dancer management
router.get('/dancers/pending', getPendingDancers);
router.get('/dancers', getAllDancers);
router.patch('/dancers/:id/approve', approveDancer);
router.delete('/dancers/:id/reject', rejectDancer);

module.exports = router;

