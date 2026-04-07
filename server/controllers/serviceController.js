const Service = require('../models/Service');

// GET /api/services — List services with optional search/filter
const getServices = async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('workerId', 'name location')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ services, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/services/:id — Get single service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('workerId', 'name location');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/services — Create service (worker only)
const createService = async (req, res) => {
  try {
    const service = await Service.create({ workerId: req.user._id, ...req.body });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/services/:id — Update service (owner only)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.workerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/services/:id — Delete service (owner only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.workerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService };
