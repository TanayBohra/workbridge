import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkers } from '../services/api';

const Search = () => {
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({ skill: '', location: '', minRating: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorkers = async () => {
    try {
      const params = { page, limit: 10 };
      if (filters.skill) params.skill = filters.skill;
      if (filters.location) params.location = filters.location;
      if (filters.minRating) params.minRating = filters.minRating;

      const { data } = await getWorkers(params);
      setWorkers(data.workers);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch workers', err);
    }
  };

  useEffect(() => { fetchWorkers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchWorkers();
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Find Workers</h2>

      <form className="search-bar" onSubmit={handleSearch}>
        <input placeholder="Skill (e.g. plumbing)" value={filters.skill}
          onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
        <input placeholder="Location" value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}>
          <option value="">Min Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {workers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>No workers found. Try different filters.</p>
      ) : (
        workers.map((w) => (
          <Link to={`/worker/${w._id}`} key={w._id}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{w.userId?.name || 'Worker'}</h3>
                <p>{w.skills?.join(', ')}</p>
                <p>{w.userId?.location} &bull; {w.experience} yrs exp &bull; ${w.hourlyRate}/hr</p>
              </div>
              <div className="rating">★ {w.rating.toFixed(1)} ({w.totalReviews})</div>
            </div>
          </Link>
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Search;
