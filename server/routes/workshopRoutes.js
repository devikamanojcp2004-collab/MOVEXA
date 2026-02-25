const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getWorkshops, getWorkshop, createWorkshop, updateWorkshop,
    deleteWorkshop, updateWorkshopStatus, getDancerWorkshops, getAllWorkshopsAdmin
} = require('../controllers/workshopController');

// Public routes
router.get('/', getWorkshops);
router.get('/:id', getWorkshop);

// Protected: dancer
router.get('/dancer/my', protect, authorizeRoles('dancer', 'admin'), getDancerWorkshops);
router.post('/', protect, authorizeRoles('dancer', 'admin'), createWorkshop);
router.put('/:id', protect, authorizeRoles('dancer', 'admin'), updateWorkshop);
router.delete('/:id', protect, authorizeRoles('dancer', 'admin'), deleteWorkshop);

// Protected: admin
router.get('/admin/all', protect, authorizeRoles('admin'), getAllWorkshopsAdmin);
router.patch('/:id/status', protect, authorizeRoles('admin'), updateWorkshopStatus);

module.exports = router;
