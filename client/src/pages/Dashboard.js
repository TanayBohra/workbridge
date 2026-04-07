import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRequests, updateRequestStatus, getServices, deleteService, getWorkerById } from '../services/api';
import { getWorkers } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [workerProfile, setWorkerProfile] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: reqs } = await getMyRequests();
      setRequests(reqs);

      if (user.role === 'worker') {
        // Get worker's services
        const { data: srvs } = await getServices({ workerId: user._id });
        setServices(srvs.services || []);
        // Get worker profile
        const { data: wData } = await getWorkers({ userId: user._id });
        if (wData.workers?.length > 0) setWorkerProfile(wData.workers[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestAction = async (id, status) => {
    try {
      await updateRequestStatus(id, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="container dashboard">
      <h2>Welcome, {user.name}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Role: {user.role}</p>

      {/* Worker-specific: Profile & Services */}
      {user.role === 'worker' && (
        <>
          <div className="section">
            <h3>My Profile</h3>
            {workerProfile ? (
              <div className="card">
                <p><strong>Skills:</strong> {workerProfile.skills?.join(', ') || 'None'}</p>
                <p><strong>Experience:</strong> {workerProfile.experience} years</p>
                <p><strong>Hourly Rate:</strong> ${workerProfile.hourlyRate}/hr</p>
                <p><strong>Rating:</strong> ★ {workerProfile.rating?.toFixed(1)} ({workerProfile.totalReviews} reviews)</p>
                <Link to="/create-profile" className="btn btn-small btn-secondary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Edit Profile</Link>
              </div>
            ) : (
              <div>
                <p>You haven't created a profile yet.</p>
                <Link to="/create-profile" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Profile</Link>
              </div>
            )}
          </div>

          <div className="section">
            <h3>My Services</h3>
            <Link to="/add-service" className="btn btn-primary btn-small" style={{ marginBottom: '1rem', display: 'inline-block' }}>+ Add Service</Link>
            {services.length === 0 ? <p>No services added yet.</p> : services.map((s) => (
              <div className="card" key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.category} &bull; {s.priceRange} &bull; {s.location}</p>
                </div>
                <button className="btn btn-danger btn-small" onClick={() => handleDeleteService(s._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Requests */}
      <div className="section">
        <h3>{user.role === 'worker' ? 'Incoming Requests' : 'My Requests'}</h3>
        {requests.length === 0 ? <p>No requests yet.</p> : requests.map((r) => (
          <div className="card request-card" key={r._id}>
            <div>
              <p><strong>{user.role === 'worker' ? `From: ${r.employerId?.name}` : `To: ${r.workerId?.name}`}</strong></p>
              <p>{r.message}</p>
              <p style={{ fontSize: '0.85rem', color: '#999' }}>
                Status: <strong style={{ color: r.status === 'accepted' ? '#27ae60' : r.status === 'rejected' ? '#e74c3c' : '#f39c12' }}>{r.status}</strong>
                &bull; {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
            {user.role === 'worker' && r.status === 'pending' && (
              <div className="request-actions">
                <button className="btn btn-success btn-small" onClick={() => handleRequestAction(r._id, 'accepted')}>Accept</button>
                <button className="btn btn-danger btn-small" onClick={() => handleRequestAction(r._id, 'rejected')}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
