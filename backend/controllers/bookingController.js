const bookingRepository = require('../repositories/bookingRepository');
const workshopRepository = require('../repositories/workshopRepository');

// @desc    Book a workshop
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { workshopId } = req.body;
        const workshop = await workshopRepository.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        if (workshop.status !== 'approved') {
            return res.status(400).json({ message: 'This workshop is not available for booking' });
        }
        if (workshop.bookingsCount >= workshop.capacity) {
            return res.status(400).json({ message: 'Workshop is fully booked' });
        }

        // Check for existing booking
        const existing = await bookingRepository.findOne(req.user._id, workshopId);
        if (existing) {
            if (existing.status === 'confirmed') {
                return res.status(400).json({ message: 'You have already booked this workshop' });
            }
            // Re-activate a cancelled booking
            const reactivated = await bookingRepository.updateStatus(existing._id, 'confirmed');
            await workshopRepository.incrementBookings(workshopId);
            return res.status(200).json(reactivated);
        }

        const booking = await bookingRepository.create(req.user._id, workshopId);
        await workshopRepository.incrementBookings(workshopId);
        await bookingRepository.populate(booking);
        res.status(201).json(booking);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'You have already booked this workshop' });
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
const getUserBookings = async (req, res) => {
    try {
        const bookings = await bookingRepository.findByUser(req.user._id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await bookingRepository.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }
        const updated = await bookingRepository.updateStatus(booking._id, 'cancelled');
        await workshopRepository.decrementBookings(booking.workshop);
        res.json({ message: 'Booking cancelled', booking: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get bookings for a specific workshop
// @route   GET /api/bookings/workshop/:workshopId
const getWorkshopBookings = async (req, res) => {
    try {
        const workshop = await workshopRepository.findById(req.params.workshopId);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        if (req.user.role !== 'admin' && workshop.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const bookings = await bookingRepository.findByWorkshop(req.params.workshopId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin – get all bookings
// @route   GET /api/bookings/admin/all
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingRepository.findAll();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getUserBookings, cancelBooking, getWorkshopBookings, getAllBookings };
