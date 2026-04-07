const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('employer'), createRequest);
router.get('/my', protect, getMyRequests);
router.put('/:id', protect, authorize('worker'), updateRequestStatus);

module.exports = router;
