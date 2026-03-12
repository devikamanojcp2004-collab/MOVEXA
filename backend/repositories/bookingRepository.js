const Booking = require('../models/Booking');

class BookingRepository {
    async create(userId, workshopId) {
        return Booking.create({ user: userId, workshop: workshopId });
    }

    async findOne(userId, workshopId) {
        return Booking.findOne({ user: userId, workshop: workshopId });
    }

    async findById(id) {
        return Booking.findById(id);
    }

    async findByUser(userId) {
        return Booking.find({ user: userId })
            .populate({
                path: 'workshop',
                populate: { path: 'instructor', select: 'name avatar' },
            })
            .sort({ createdAt: -1 });
    }

    async findByWorkshop(workshopId) {
        return Booking.find({ workshop: workshopId })
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });
    }

    async findAll() {
        return Booking.find({})
            .populate('user', 'name email')
            .populate({
                path: 'workshop',
                select: 'title style date',
                populate: { path: 'instructor', select: 'name' },
            })
            .sort({ createdAt: -1 });
    }

    async updateStatus(id, status) {
        const booking = await Booking.findById(id);
        if (!booking) return null;
        booking.status = status;
        return booking.save();
    }

    async deleteByWorkshop(workshopId) {
        return Booking.deleteMany({ workshop: workshopId });
    }

    async deleteByUser(userId) {
        return Booking.deleteMany({ user: userId });
    }

    async countConfirmed() {
        return Booking.countDocuments({ status: 'confirmed' });
    }

    async populate(booking) {
        return booking.populate([
            { path: 'workshop', populate: { path: 'instructor', select: 'name avatar' } },
        ]);
    }
}

module.exports = new BookingRepository();
