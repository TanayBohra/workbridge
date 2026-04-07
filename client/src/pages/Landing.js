import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    <div className="hero">
      <h2>Find Skilled Professionals Near You</h2>
      <p>WorkBridge connects you with trusted workers — plumbers, electricians, tutors, and more.</p>
      <div className="hero-buttons">
        <Link to="/search" className="btn btn-secondary">Find Workers</Link>
        <Link to="/register" className="btn btn-primary">Join as Worker</Link>
      </div>
    </div>
  </div>
);

export default Landing;
