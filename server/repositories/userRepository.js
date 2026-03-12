const User = require('../models/User');

class UserRepository {
    async findById(id) {
        return User.findOne({ _id: id, isDeleted: { $ne: true } }).select('-password');
    }

    async findByIdWithPassword(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email, isDeleted: { $ne: true } });
    }

    async create(data) {
        return User.create(data);
    }

    async update(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    }

    async softDelete(id) {
        return User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }

    async findAll() {
        return User.find({ isDeleted: { $ne: true } }).select('-password').sort({ createdAt: -1 });
    }

    async findAllDancers() {
        return User.find({ role: 'dancer', isDeleted: { $ne: true } }).select('-password').sort({ name: 1 });
    }

    async findPendingDancers() {
        return User.find({ role: 'dancer', isApproved: false, isDeleted: { $ne: true } }).select('-password').sort({ createdAt: -1 });
    }

    async approveDancer(id) {
        return User.findByIdAndUpdate(id, { isApproved: true }, { new: true }).select('-password');
    }

    async findByGoogleId(googleId) {
        return User.findOne({ googleId });
    }

    async findOrCreateGoogleUser({ googleId, email, name, avatar, role = 'user' }) {
        let user = await User.findOne({ $or: [{ googleId }, { email }], isDeleted: { $ne: true } });
        if (user) {
            // Link Google account if not already linked
            if (!user.googleId) user.googleId = googleId;
            // If a non-default role was explicitly requested (register flow) and differs from current, update it
            if (role !== 'user' && user.role !== role) {
                user.role = role;
                // isApproved will be reset by the pre-save hook (dancers start unapproved)
            }
            await user.save();
            return user;
        }
        // Brand-new user: create with selected role
        return User.create({ googleId, email, name, avatar, role, isApproved: role !== 'dancer' });
    }


    async countByRole(role) {
        return User.countDocuments({ role, isDeleted: { $ne: true } });
    }
}

module.exports = new UserRepository();
