import React, { useEffect, useRef, useState } from 'react';

interface DoodleMuseumTitleProps {
  animationDelay?: number;
}

export const DoodleMuseumTitle: React.FC<DoodleMuseumTitleProps> = ({ animationDelay = 0 }) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [pathLengths, setPathLengths] = useState<number[]>([]);

  useEffect(() => {
    // Calculate path lengths once component mounts
    const lengths = pathRefs.current.map(path => path ? path.getTotalLength() : 0);
    setPathLengths(lengths);
  }, []);

  return (
    <svg 
      viewBox="0 0 400 100" 
      className="w-full max-w-lg h-auto"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* "Doodle" word */}
      <g>
        <path 
          ref={el => { pathRefs.current[0] = el }}
          d="M 20 40 Q 10 20, 40 10 Q 70 0, 80 30 Q 90 60, 60 70 Q 30 80, 20 50" // D
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[0], strokeDashoffset: pathLengths[0], animationDelay: `${animationDelay}s` }}
        />
        <path 
          ref={el => { pathRefs.current[1] = el }}
          d="M 90 40 A 20 20 0 1 1 90 60" // o1
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[1], strokeDashoffset: pathLengths[1], animationDelay: `${animationDelay + 0.2}s` }}
        />
        <path 
          ref={el => { pathRefs.current[2] = el }}
          d="M 120 40 A 20 20 0 1 1 120 60" // o2
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[2], strokeDashoffset: pathLengths[2], animationDelay: `${animationDelay + 0.4}s` }}
        />
        <path 
          ref={el => { pathRefs.current[3] = el }}
          d="M 150 40 L 150 70 M 150 55 H 170" // d
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[3], strokeDashoffset: pathLengths[3], animationDelay: `${animationDelay + 0.6}s` }}
        />
        <path 
          ref={el => { pathRefs.current[4] = el }}
          d="M 180 40 L 180 70 L 200 70 L 200 40" // l
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[4], strokeDashoffset: pathLengths[4], animationDelay: `${animationDelay + 0.8}s` }}
        />
        <path 
          ref={el => { pathRefs.current[5] = el }}
          d="M 210 40 L 210 70 L 230 70 L 230 40" // e
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[5], strokeDashoffset: pathLengths[5], animationDelay: `${animationDelay + 1.0}s` }}
        />
      </g>

      {/* "Museum" word (simplified) */}
      <g transform="translate(20 30)"> {/* Shift Museum word slightly */}
        <path 
          ref={el => { pathRefs.current[6] = el }}
          d="M 20 40 L 40 10 L 60 40 L 80 10 L 100 40" // M
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[6], strokeDashoffset: pathLengths[6], animationDelay: `${animationDelay + 1.2}s` }}
        />
        <path 
          ref={el => { pathRefs.current[7] = el }}
          d="M 110 40 A 20 20 0 1 1 110 60" // u
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[7], strokeDashoffset: pathLengths[7], animationDelay: `${animationDelay + 1.4}s` }}
        />
        <path 
          ref={el => { pathRefs.current[8] = el }}
          d="M 140 40 A 20 20 0 1 1 140 60" // s
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[8], strokeDashoffset: pathLengths[8], animationDelay: `${animationDelay + 1.6}s` }}
        />
        <path 
          ref={el => { pathRefs.current[9] = el }}
          d="M 170 40 A 20 20 0 1 1 170 60" // e
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[9], strokeDashoffset: pathLengths[9], animationDelay: `${animationDelay + 1.8}s` }}
        />
        <path 
          ref={el => { pathRefs.current[10] = el }}
          d="M 200 40 A 20 20 0 1 1 200 60" // u (again for simplicity)
          className="doodle-draw"
          style={{ strokeDasharray: pathLengths[10], strokeDashoffset: pathLengths[10], animationDelay: `${animationDelay + 2.0}s` }}
        />
      </g>
    </svg>
  );
};
