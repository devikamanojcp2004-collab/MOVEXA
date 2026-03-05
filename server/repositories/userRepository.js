const User = require('../models/User');

class UserRepository {
    async findById(id) {
        return User.findById(id).select('-password');
    }

    async findByIdWithPassword(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async create(data) {
        return User.create(data);
    }

    async update(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    }

    async delete(id) {
        return User.findByIdAndDelete(id);
    }

    async findAll() {
        return User.find({}).select('-password').sort({ createdAt: -1 });
    }

    async findAllDancers() {
        return User.find({ role: 'dancer' }).select('-password').sort({ name: 1 });
    }

    async findPendingDancers() {
        return User.find({ role: 'dancer', isApproved: false }).select('-password').sort({ createdAt: -1 });
    }

    async approveDancer(id) {
        return User.findByIdAndUpdate(id, { isApproved: true }, { new: true }).select('-password');
    }

    async findByGoogleId(googleId) {
        return User.findOne({ googleId });
    }

    async findOrCreateGoogleUser({ googleId, email, name, avatar }) {
        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (user) {
            if (!user.googleId) { user.googleId = googleId; await user.save(); }
            return user;
        }
        return User.create({ googleId, email, name, avatar, role: 'user', isApproved: true });
    }


    async countByRole(role) {
        return User.countDocuments({ role });
    }
}

module.exports = new UserRepository();
