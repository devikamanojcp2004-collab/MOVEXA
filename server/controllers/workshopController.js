const workshopRepository = require('../repositories/workshopRepository');
const bookingRepository = require('../repositories/bookingRepository');

// Helper: ensure workshop datetime is at least 24 hours from now
const validateWorkshopDateTime = (date, time) => {
    if (!date) return null; // let model validation catch missing field

    // Combine date + time if time is provided, otherwise use start of day
    const dateTimeStr = time ? `${date}T${time}` : `${date}T00:00:00`;
    const selected = new Date(dateTimeStr);

    if (isNaN(selected.getTime())) return 'Invalid date or time format.';

    const minAllowed = new Date(Date.now() + 24 * 60 * 60 * 1000); // now + 24h
    if (selected < minAllowed) {
        return 'Workshop must be scheduled at least 24 hours from now.';
    }
    return null;
};

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
        const dateErr = validateWorkshopDateTime(req.body.date, req.body.time);
        if (dateErr) return res.status(400).json({ message: dateErr });

        const workshop = await workshopRepository.create({
            ...req.body,
            instructor: req.user._id,
            status: 'approved',   // auto-approved – no admin review needed
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

        const dateToCheck = req.body.date || workshop.date?.toISOString().split('T')[0];
        const timeToCheck = req.body.time || workshop.time;
        const dateErr = validateWorkshopDateTime(dateToCheck, timeToCheck);
        if (dateErr) return res.status(400).json({ message: dateErr });

        const updated = await workshopRepository.update(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Soft-delete workshop (marks isDeleted:true, keeps data in DB)
// @route   DELETE /api/workshops/:id
const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await workshopRepository.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        if (req.user.role !== 'admin' && workshop.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await workshopRepository.softDelete(req.params.id);
        res.json({ message: 'Workshop removed successfully' });
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
