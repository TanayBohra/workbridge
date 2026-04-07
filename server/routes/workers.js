const express = require('express');
const router = express.Router();
const { getWorkers, getWorkerById, createProfile, updateProfile } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.post('/', protect, authorize('worker'), createProfile);
router.put('/:id', protect, authorize('worker'), updateProfile);

module.exports = router;
