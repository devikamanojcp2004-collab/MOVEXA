const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { createBooking, getUserBookings, cancelBooking, getWorkshopBookings, getAllBookings } = require('../controllers/bookingController');

router.post('/', protect, authorizeRoles('user'), createBooking);
router.get('/my', protect, getUserBookings);
router.patch('/:id/cancel', protect, cancelBooking);
router.get('/workshop/:workshopId', protect, authorizeRoles('dancer', 'admin'), getWorkshopBookings);
router.get('/admin/all', protect, authorizeRoles('admin'), getAllBookings);

module.exports = router;
