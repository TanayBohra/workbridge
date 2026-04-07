import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkerProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ skills: '', experience: 0, hourlyRate: 0, availability: true });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkerProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
    }
  };

  if (!user || user.role !== 'worker') {
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Only workers can create a profile.</p>;
  }

  return (
    <div className="form-page">
      <h2>Create Worker Profile</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="e.g. Plumbing, Electrical, Painting" required />
        </div>
        <div className="form-group">
          <label>Years of Experience</label>
          <input type="number" min="0" value={form.experience}
            onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })} />
        </div>
        <div className="form-group">
          <label>Hourly Rate ($)</label>
          <input type="number" min="0" value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" checked={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.checked })} /> Available for work
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateProfile;
