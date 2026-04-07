import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', priceRange: '', location: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createService(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    }
  };

  if (!user || user.role !== 'worker') {
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Only workers can add services.</p>;
  }

  return (
    <div className="form-page">
      <h2>Add a Service</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Plumbing, Tutoring" required />
        </div>
        <div className="form-group">
          <label>Price Range</label>
          <input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
            placeholder="e.g. $50-$100" />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Brooklyn, NY" />
        </div>
        <button type="submit" className="btn btn-primary">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;
