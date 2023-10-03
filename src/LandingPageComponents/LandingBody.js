import React, { useState } from 'react';
import './LandingBody.css';
import { Link } from 'react-router-dom';
const LandingPage = () => {
  const [isDark, setIsDark] = useState(false);

  const handleMouseEnter = () => {
    setIsDark(true);
  };

  const handleMouseLeave = () => {
    setIsDark(false);
  };


  return (
    
    <div class="container">

    <div
      className={`landing-page ${isDark ? 'dark' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <main className="content">
        <h1 class="welcome-heading glow">Make your API TMF compliant now!</h1>
        <Link to={"/Gallery"} className="button">Login as Admin</Link>
        <Link to={"/Home"} className="button">Try for free</Link>

      </main>

    </div>
    </div>
  );
};

export default LandingPage;
