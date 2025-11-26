import React from 'react';

export const HeroDoodles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Squiggle Top Left */}
      <svg className="absolute top-10 left-10 w-24 h-24 text-stone-300 animate-float opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M10 50 Q 25 25, 40 50 T 70 50 T 100 50" />
      </svg>

      {/* Star Top Right */}
      <svg className="absolute top-20 right-20 w-16 h-16 text-yellow-400/50 animate-wiggle opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="50 5, 61 35, 95 35, 68 57, 79 91, 50 70, 21 91, 32 57, 5 35, 39 35" />
      </svg>

      {/* Spiral Bottom Left */}
      <svg className="absolute bottom-32 left-20 w-32 h-32 text-blue-300/40 animate-spin-slow opacity-60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M50 50 m 0 0 a 5 5 0 1 0 10 0 a 10 10 0 1 0 -20 0 a 15 15 0 1 0 30 0 a 20 20 0 1 0 -40 0 a 25 25 0 1 0 50 0" />
      </svg>

      {/* Circle/Dot Cluster Bottom Right */}
      <div className="absolute bottom-20 right-1/4 animate-float-delayed opacity-50">
        <svg className="w-20 h-20 text-red-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="50" cy="50" r="20" />
          <circle cx="80" cy="20" r="5" fill="currentColor" />
          <circle cx="20" cy="80" r="8" />
        </svg>
      </div>

      {/* Random Zigzag Middle Left */}
      <svg className="absolute top-1/2 left-10 w-20 h-40 text-stone-400/30 animate-wiggle opacity-50" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
         <path d="M10 10 L 40 30 L 10 50 L 40 70 L 10 90" />
      </svg>

      {/* Pencil Icon Floating */}
      <svg className="absolute top-1/3 right-10 w-24 h-24 text-stone-800/10 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>

      {/* Big Friendly Dinosaur */}
      <div className="absolute bottom-[-20px] left-[-20px] md:left-10 opacity-20 animate-float-delayed rotate-12 text-stone-600">
        <svg width="300" height="300" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
           {/* Body & Neck */}
           <path d="M 40 140 
                    Q 30 100, 60 90 
                    Q 80 80, 100 80 
                    Q 120 80, 130 60 
                    Q 140 40, 160 40 
                    Q 180 40, 175 60 
                    Q 170 70, 150 80 
                    Q 140 130, 130 140 
                    Q 120 160, 90 150 
                    Z" />
           {/* Legs */}
           <path d="M 60 130 L 60 170" />
           <path d="M 90 140 L 90 180" />
           {/* Tail */}
           <path d="M 40 140 Q 10 150, 20 120" />
           {/* Eye */}
           <circle cx="160" cy="50" r="2" fill="currentColor" />
           {/* Smile */}
           <path d="M 165 60 Q 170 65, 175 60" />
           {/* Back Spikes */}
           <path d="M 60 90 L 55 80 L 65 85 M 80 80 L 75 70 L 85 75 M 100 80 L 95 70 L 105 75" />
        </svg>
      </div>
    </div>
  );
};
