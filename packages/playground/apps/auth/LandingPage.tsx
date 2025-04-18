import { useAuth } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import StarkWordmark from '../assets/Stark-Wordmark-White.svg';
import './styles.css';

function createStars() {
  const stars = [];
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random();
    const delay = Math.random() * 3;

    let sizeClass = 'small';
    if (size > 0.8) sizeClass = 'large';
    else if (size > 0.6) sizeClass = 'medium';

    stars.push({
      x,
      y,
      class: sizeClass,
      style: {
        left: `${x}%`,
        top: `${y}%`,
        animation: `twinkle 3s ease-in-out ${delay}s infinite`,
      },
    });
  }
  return stars;
}

export function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef(createStars());

  useEffect(() => {
    if (isSignedIn) {
      navigate('/playground');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="cyberpunk-container" ref={containerRef}>
      {starsRef.current.map((star, index) => (
        <div className={`star ${star.class}`} key={index} style={star.style} />
      ))}
      <div className="logo-container">
        <img
          alt="Stark Wordmark"
          className="wordmark-logo"
          src={StarkWordmark}
        />
      </div>
      <p className="subtitle">The Future of Digital Collaboration</p>
      <div className="button-container">
        <button
          className="cyber-button cyan"
          onClick={() => navigate('/sign-in')}
        >
          Sign In
        </button>
        <button
          className="cyber-button orange"
          onClick={() => navigate('/sign-up')}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
