const WorkerProfile = require('../models/WorkerProfile');

// GET /api/workers — Get all worker profiles (with optional filters)
const getWorkers = async (req, res) => {
  try {
    const { skill, location, minRating, minExperience, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (skill) filter.skills = { $regex: skill, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (minExperience) filter.experience = { $gte: Number(minExperience) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await WorkerProfile.countDocuments(filter);
    const workers = await WorkerProfile.find(filter)
      .populate('userId', 'name email location')
      .skip(skip)
      .limit(Number(limit));

    res.json({ workers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workers/:id — Get a single worker profile
const getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id)
      .populate('userId', 'name email location');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workers — Create worker profile (worker only)
const createProfile = async (req, res) => {
  try {
    const existing = await WorkerProfile.findOne({ userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });

    const profile = await WorkerProfile.create({ userId: req.user._id, ...req.body });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/workers/:id — Update worker profile (owner only)
const updateProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkers, getWorkerById, createProfile, updateProfile };
