const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');
const Request = require('../models/Request');

// POST /api/reviews — Employer leaves a review (only after accepted request)
const createReview = async (req, res) => {
  try {
    const { workerId, rating, comment } = req.body;

    // Verify there's an accepted request between this employer and worker
    const acceptedRequest = await Request.findOne({
      employerId: req.user._id,
      workerId,
      status: 'accepted'
    });
    if (!acceptedRequest) {
      return res.status(400).json({ message: 'You can only review after an accepted request' });
    }

    const review = await Review.create({
      employerId: req.user._id,
      workerId,
      rating,
      comment
    });

    // Update worker's average rating
    const allReviews = await Review.find({ workerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await WorkerProfile.findOneAndUpdate(
      { userId: workerId },
      { rating: Math.round(avgRating * 10) / 10, totalReviews: allReviews.length }
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/:workerId — Get all reviews for a worker
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('employerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getWorkerReviews };
