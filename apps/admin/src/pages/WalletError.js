import React, { useState, useEffect, useRef } from 'react';
import './anim.css'; // Create this CSS file
import { useNavigate } from 'react-router-dom';

function WalletError() {
  const [countdown, setCountdown] = useState(5);
  const canvasRef = useRef(null);
const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let particlesArray;

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesArray = [];
      const numberOfParticles = (canvas.height * canvas.width) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 5 + 1;
        const speedX = Math.random() * 3 - 1.5;
        const speedY = Math.random() * 3 - 1.5;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
      }
    }

    class Particle {
      constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
      }
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
        this.draw();
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
    }

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
      window.location.reload(); // Reload the page to attempt reconnection
    }
  }, [countdown, navigate]);

  return (
    <div className="particle-container">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="content">
        <h1>Wallet Connection Error</h1>
        <p>
          There was an issue connecting to your MetaMask wallet. Please ensure
          MetaMask is installed and unlocked.
        </p>
        <p>Attempting to reconnect in {countdown} seconds...</p>
      </div>
    </div>
  );
}

export default WalletError;