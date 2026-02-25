const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAllUsers, updateUserRole, deleteUser, getStats, getPendingDancers, approveDancer } = require('../controllers/adminController');

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Dancer approval
router.get('/dancers/pending', getPendingDancers);
router.patch('/dancers/:id/approve', approveDancer);

module.exports = router;

