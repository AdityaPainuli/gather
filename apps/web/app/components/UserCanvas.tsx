"use client"
import React, { useEffect, useRef, useState } from 'react';

const UserCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let randomXPosition = Math.random() * (window.innerWidth);
  let randomYPosition = Math.random() * (window.innerHeight);
  const [position, setPosition] = useState({ x: randomXPosition,  y: randomYPosition});
  const dotRadius = 10; 

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      setPosition((prev) => ({
        x: Math.min(prev.x, canvas.width - dotRadius),
        y: Math.min(prev.y, canvas.height - dotRadius),
      }));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    setPosition((prev) => {
      const newPosition = { ...prev };
      const step = 10; 

      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(prev.y - step, dotRadius);
          break;
        case 'ArrowDown': 
          newPosition.y = Math.min(prev.y + step, window.innerHeight - dotRadius);
          break;
        case 'ArrowLeft': 
          newPosition.x = Math.max(prev.x - step, dotRadius);
          break;
        case 'ArrowRight': 
          newPosition.x = Math.min(prev.x + step, window.innerWidth - dotRadius);
          break;
      }
      return newPosition;
    });
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(position.x, position.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red"; 
        ctx.fill();
        ctx.closePath();
      }
    }
  };

  useEffect(() => {
    draw();
  }, [position]);

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas); 
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'lightgray', 
      }}
    />
  );
};

export default UserCanvas;
