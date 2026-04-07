const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, authorize('worker'), createService);
router.put('/:id', protect, authorize('worker'), updateService);
router.delete('/:id', protect, authorize('worker'), deleteService);

module.exports = router;
