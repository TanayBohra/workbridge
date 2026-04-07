const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  skills: [{ type: String, trim: true }],
  experience: { type: Number, default: 0 },        // years of experience
  availability: { type: Boolean, default: true },
  hourlyRate: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
