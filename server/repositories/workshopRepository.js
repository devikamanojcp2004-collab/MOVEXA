const Workshop = require('../models/Workshop');

class WorkshopRepository {
    async findAll({ style, location, search, page = 1, limit = 12, status = 'approved' } = {}) {
        const query = { status, isDeleted: { $ne: true } };
        if (style) query.style = style;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const total = await Workshop.countDocuments(query);
        const workshops = await Workshop.find(query)
            .populate('instructor', 'name avatar bio')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        return { workshops, total, page: Number(page), pages: Math.ceil(total / limit) };
    }

    async findById(id) {
        return Workshop.findById(id).populate('instructor', 'name avatar bio email');
    }

    async findByInstructor(instructorId) {
        return Workshop.find({ instructor: instructorId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    }

    async findByInstructorPublic(instructorId) {
        return Workshop.find({ instructor: instructorId, status: 'approved', isDeleted: { $ne: true } })
            .sort({ date: 1 });
    }

    async findAllAdmin(status) {
        const query = status ? { status, isDeleted: { $ne: true } } : { isDeleted: { $ne: true } };
        return Workshop.find(query)
            .populate('instructor', 'name email avatar')
            .sort({ createdAt: -1 });
    }

    async create(data) {
        const workshop = await Workshop.create(data);
        return workshop.populate('instructor', 'name avatar');
    }

    async update(id, data) {
        return Workshop.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('instructor', 'name avatar');
    }

    async updateStatus(id, status) {
        return Workshop.findByIdAndUpdate(id, { status }, { new: true })
            .populate('instructor', 'name avatar');
    }

    async softDelete(id) {
        return Workshop.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }

    async incrementBookings(id) {
        return Workshop.findByIdAndUpdate(id, { $inc: { bookingsCount: 1 } });
    }

    async decrementBookings(id) {
        return Workshop.findByIdAndUpdate(id, { $inc: { bookingsCount: -1 } });
    }

    async countAll() {
        return Workshop.countDocuments({ isDeleted: { $ne: true } });
    }

    async countByStatus(status) {
        return Workshop.countDocuments({ status, isDeleted: { $ne: true } });
    }
}

module.exports = new WorkshopRepository();
