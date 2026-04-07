const Request = require('../models/Request');

// POST /api/requests — Employer sends a job request to a worker
const createRequest = async (req, res) => {
  try {
    const { workerId, message } = req.body;
    const request = await Request.create({
      employerId: req.user._id,
      workerId,
      message
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/my — Get requests for the logged-in user
// Workers see incoming requests; employers see their sent requests
const getMyRequests = async (req, res) => {
  try {
    const filter = req.user.role === 'worker'
      ? { workerId: req.user._id }
      : { employerId: req.user._id };

    const requests = await Request.find(filter)
      .populate('employerId', 'name email')
      .populate('workerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/:id — Worker accepts or rejects a request
const updateRequestStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only the targeted worker can respond
    if (request.workerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, updateRequestStatus };
