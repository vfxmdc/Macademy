'use client';

import { useState, useEffect } from 'react';

export default function HeroFloatingDecor3D() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[450px] flex items-center justify-center perspective-[1000px] select-none">
      {/* Soft Ambient Radial Lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#D4A359]/30 via-[#8B5E3C]/20 to-transparent blur-3xl animate-pulse" />
      
      {/* 3D Container with Tilt Effect */}
      <div 
        className="relative w-72 h-72 sm:w-80 sm:h-80 transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Floating Outer Ring 1 */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-[#D4A359]/40 animate-decor-float shadow-[0_0_30px_rgba(212,163,89,0.2)]"
          style={{ transform: 'translateZ(40px) rotateX(65deg) rotateY(15deg)' }}
        />

        {/* Floating Outer Ring 2 */}
        <div 
          className="absolute inset-4 rounded-full border border-[#8B5E3C]/60 animate-decor-float"
          style={{ 
            transform: 'translateZ(80px) rotateX(-50deg) rotateY(40deg)',
            animationDelay: '1.5s' 
          }}
        />

        {/* Central Levitating 3D Prism / Academy Crest Object */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-52 sm:h-52 animate-decor-float"
          style={{ transformStyle: 'preserve-3d', animationDelay: '0.5s' }}
        >
          {/* Glowing Core Sphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#5C4732] via-[#8B5E3C] to-[#D4A359] shadow-[0_10px_35px_rgba(92,71,50,0.4)] border border-[#FFFDF9]/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFFDF9]/90 to-[#D4A359]/80 blur-[2px] opacity-80 animate-ping" style={{ animationDuration: '3s' }} />
            <span className="absolute text-4xl sm:text-5xl drop-shadow-md">🎓</span>
          </div>

          {/* Floating Orbiting Accent Nodes */}
          <div 
            className="absolute -top-4 right-2 w-10 h-10 rounded-2xl bg-[#FFFDF9] border border-[#D4A359] shadow-lg flex items-center justify-center text-lg animate-bounce"
            style={{ animationDuration: '4s' }}
          >
            📚
          </div>

          <div 
            className="absolute -bottom-2 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5E3C] to-[#5C4732] border border-[#D4A359]/60 shadow-xl flex items-center justify-center text-xl text-[#FFFDF9]"
          >
            🏆
          </div>

          <div 
            className="absolute top-1/3 -right-8 w-11 h-11 rounded-2xl bg-[#F5EFE6] border border-[#8B5E3C]/40 shadow-md flex items-center justify-center text-lg"
          >
            🔑
          </div>
        </div>

        {/* Floating Interior Frame Lines */}
        <div 
          className="absolute inset-10 border-2 border-dashed border-[#5C4732]/30 rounded-3xl"
          style={{ transform: 'translateZ(-30px) rotate(45deg)' }}
        />
      </div>

      {/* Realistic 3D Ground Shadow */}
      <div className="absolute -bottom-4 w-60 h-8 rounded-[100%] bg-[#5C4732]/15 blur-md animate-decor-pulse" />
    </div>
  );
}
