const workshopRepository = require('../repositories/workshopRepository');
const bookingRepository = require('../repositories/bookingRepository');

// @desc    Get all approved workshops (public, filterable)
// @route   GET /api/workshops
const getWorkshops = async (req, res) => {
    try {
        const result = await workshopRepository.findAll(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single workshop
// @route   GET /api/workshops/:id
const getWorkshop = async (req, res) => {
    try {
        const workshop = await workshopRepository.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create workshop (dancer)
// @route   POST /api/workshops
const createWorkshop = async (req, res) => {
    try {
        const workshop = await workshopRepository.create({
            ...req.body,
            instructor: req.user._id,
            status: 'pending',
        });
        res.status(201).json(workshop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update workshop (dancer owns it or admin)
// @route   PUT /api/workshops/:id
const updateWorkshop = async (req, res) => {
    try {
        const workshop = await workshopRepository.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        if (req.user.role !== 'admin' && workshop.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this workshop' });
        }
        const updated = await workshopRepository.update(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await workshopRepository.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        if (req.user.role !== 'admin' && workshop.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await workshopRepository.delete(req.params.id);
        await bookingRepository.deleteByWorkshop(req.params.id);
        res.json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update workshop status (admin only)
// @route   PATCH /api/workshops/:id/status
const updateWorkshopStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const workshop = await workshopRepository.updateStatus(req.params.id, status);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dancer's own workshops
// @route   GET /api/workshops/dancer/my
const getDancerWorkshops = async (req, res) => {
    try {
        const workshops = await workshopRepository.findByInstructor(req.user._id);
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all workshops (admin – any status)
// @route   GET /api/workshops/admin/all
const getAllWorkshopsAdmin = async (req, res) => {
    try {
        const workshops = await workshopRepository.findAllAdmin(req.query.status);
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkshops, getWorkshop, createWorkshop, updateWorkshop,
    deleteWorkshop, updateWorkshopStatus, getDancerWorkshops, getAllWorkshopsAdmin,
};
