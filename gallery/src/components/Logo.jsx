import React from 'react';
import '../styles/style.css';

function Logo() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Picture Frame Icon"
      style={{ cursor: 'pointer' }}
    >
      {/* Animated frame with changing stroke color */}
      <rect
        x="5"
        y="5"
        width="54"
        height="54"
        rx="4"
        ry="4"
        fill="none"
        stroke="#4361ee"
        strokeWidth="4"
      >
        <animate
          attributeName="stroke"
          values="#4361ee;#3f37c9;#4cc9f0"
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Rotating picture group */}
      <g>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          values="-5 32 32;5 32 32;-5 32 32"
          dur="4s"
          repeatCount="indefinite"
        />

        {/* Mountain */}
        <polygon points="12,48 26,28 38,48" fill="#3f37c9" opacity="0.8" />

        {/* Sun/Moon with blinking effect */}
        <circle cx="46" cy="22" r="7">
          <animate
            attributeName="fill"
            values="#FFD700;#CCCCCC;#FFD700"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Grass or base element */}
        <rect x="40" y="44" width="12" height="6" fill="#4bb543" opacity="0.8" />
      </g>
    </svg>
  );
}

export default Logo;
