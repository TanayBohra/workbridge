import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkerById, getWorkerReviews, sendRequest, createReview } from '../services/api';
import { getServices } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WorkerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [requestMsg, setRequestMsg] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: w } = await getWorkerById(id);
        setWorker(w);
        // Fetch services by this worker's userId
        const { data: s } = await getServices({ workerId: w.userId?._id });
        setServices(s.services || []);
        const { data: r } = await getWorkerReviews(w.userId?._id);
        setReviews(r);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleSendRequest = async () => {
    try {
      await sendRequest({ workerId: worker.userId._id, message: requestMsg });
      setStatus('Request sent!');
      setRequestMsg('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ workerId: worker.userId._id, ...reviewForm });
      setStatus('Review submitted!');
      // Refresh reviews
      const { data } = await getWorkerReviews(worker.userId._id);
      setReviews(data);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!worker) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar">{worker.userId?.name?.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h2>{worker.userId?.name}</h2>
          <p>{worker.userId?.location}</p>
          <p>{worker.experience} years experience &bull; ${worker.hourlyRate}/hr</p>
          <p className="rating">★ {worker.rating.toFixed(1)} ({worker.totalReviews} reviews)</p>
          <div className="skills-list">
            {worker.skills?.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
          </div>
          <p style={{ marginTop: '0.5rem' }}>{worker.availability ? '🟢 Available' : '🔴 Unavailable'}</p>
        </div>
      </div>

      {/* Services */}
      <div className="section">
        <h3>Services</h3>
        {services.length === 0 ? <p>No services listed yet.</p> : services.map((s) => (
          <div className="card" key={s._id}>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <p><strong>Category:</strong> {s.category} &bull; <strong>Price:</strong> {s.priceRange} &bull; <strong>Location:</strong> {s.location}</p>
          </div>
        ))}
      </div>

      {/* Send Request (employer only) */}
      {user?.role === 'employer' && (
        <div className="section">
          <h3>Send a Job Request</h3>
          <div className="form-group">
            <textarea placeholder="Describe what you need..." value={requestMsg}
              onChange={(e) => setRequestMsg(e.target.value)} rows={3}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }} />
          </div>
          <button className="btn btn-primary" onClick={handleSendRequest}>Send Request</button>
          {status && <p style={{ marginTop: '0.5rem', color: '#667eea' }}>{status}</p>}
        </div>
      )}

      {/* Reviews */}
      <div className="section">
        <h3>Reviews</h3>
        {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((r) => (
          <div className="card review-card" key={r._id}>
            <p className="reviewer">{r.employerId?.name}</p>
            <p className="rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p>{r.comment}</p>
            <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Leave Review (employer only) */}
      {user?.role === 'employer' && (
        <div className="section">
          <h3>Leave a Review</h3>
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label>Rating</label>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-small">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkerProfile;
