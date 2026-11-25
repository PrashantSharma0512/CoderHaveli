'use client';

import React, { useId } from 'react';

interface HaveliCoinIconProps {
  className?: string;
  size?: number;
}

/**
 * HaveliCoinIcon — Luxury Hexagonal Cyber-Gold "<H>" Token
 * Features a 3D double-bevel 24k gold hexagon, deep obsidian-bronze core,
 * micro circuit-trace accents, raised luminous "<H>" emblem, and a subtle animated shimmer.
 */
export default function HaveliCoinIcon({ className = '', size = 20 }: HaveliCoinIconProps) {
  const uid = useId().replace(/:/g, '');
  const outerGrad = `hct-outer-${uid}`;
  const bevelGrad = `hct-bevel-${uid}`;
  const coreGrad = `hct-core-${uid}`;
  const emblemGrad = `hct-emblem-${uid}`;
  const shimmerGrad = `hct-shimmer-${uid}`;
  const clipId = `hct-clip-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* 24k Gold Outer Rim */}
        <linearGradient id={outerGrad} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="28%" stopColor="#FACC15" />
          <stop offset="68%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Inner Chamfered Gold Bevel */}
        <linearGradient id={bevelGrad} x1="34" y1="34" x2="6" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>

        {/* Deep Obsidian-Bronze Recessed Core */}
        <radialGradient id={coreGrad} cx="45%" cy="35%" r="68%">
          <stop offset="0%" stopColor="#522005" />
          <stop offset="55%" stopColor="#261003" />
          <stop offset="100%" stopColor="#0F0501" />
        </radialGradient>

        {/* Raised 24k Gold "<H>" Emblem */}
        <linearGradient id={emblemGrad} x1="10" y1="12" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FEF08A" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Animated Metallic Shimmer Sweep */}
        <linearGradient id={shimmerGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.45" />
          <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <clipPath id={clipId}>
          <path d="M18.3 2.5C19.3 1.9 20.7 1.9 21.7 2.5L34.3 9.8C35.3 10.4 36 11.5 36 12.7V27.3C36 28.5 35.3 29.6 34.3 30.2L21.7 37.5C20.7 38.1 19.3 38.1 18.3 37.5L5.7 30.2C4.7 29.6 4 28.5 4 27.3V12.7C4 11.5 4.7 10.4 5.7 9.8L18.3 2.5Z" />
        </clipPath>
      </defs>

      {/* Outer 3D Gold Hexagon */}
      <path
        d="M18.3 2.5C19.3 1.9 20.7 1.9 21.7 2.5L34.3 9.8C35.3 10.4 36 11.5 36 12.7V27.3C36 28.5 35.3 29.6 34.3 30.2L21.7 37.5C20.7 38.1 19.3 38.1 18.3 37.5L5.7 30.2C4.7 29.6 4 28.5 4 27.3V12.7C4 11.5 4.7 10.4 5.7 9.8L18.3 2.5Z"
        fill={`url(#${outerGrad})`}
      />

      {/* Chamfered Mid Bevel */}
      <path
        d="M18.7 4.4C19.5 3.9 20.5 3.9 21.3 4.4L32.6 10.9C33.4 11.4 33.9 12.2 33.9 13.1V26.9C33.9 27.8 33.4 28.6 32.6 29.1L21.3 35.6C20.5 36.1 19.5 36.1 18.7 35.6L7.4 29.1C6.6 28.6 6.1 27.8 6.1 26.9V13.1C6.1 12.2 6.6 11.4 7.4 10.9L18.7 4.4Z"
        fill={`url(#${bevelGrad})`}
      />

      {/* Recessed Obsidian-Bronze Core */}
      <path
        d="M19 6.2C19.6 5.8 20.4 5.8 21 6.2L31 12C31.6 12.4 32 13 32 13.7V26.3C32 27 31.6 27.6 31 28L21 33.8C20.4 34.2 19.6 34.2 19 33.8L9 28C8.4 27.6 8 27 8 26.3V13.7C8 13 8.4 12.4 9 12L19 6.2Z"
        fill={`url(#${coreGrad})`}
        stroke="#FDE047"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />

      {/* Subtle Micro Circuit-Trace Accents */}
      <g stroke="#F59E0B" strokeOpacity="0.35" strokeWidth="0.85" strokeLinecap="round">
        <path d="M20 6.5V9.2" />
        <path d="M20 30.8V33.5" />
        <path d="M9.5 13.5L12 15" />
        <path d="M30.5 13.5L28 15" />
        <path d="M9.5 26.5L12 25" />
        <path d="M30.5 26.5L28 25" />
      </g>

      {/* Top & Bottom Crown Diamond Nodes */}
      <path d="M20 7.7L21.3 9.2L20 10.7L18.7 9.2Z" fill="#FEF08A" />
      <path d="M20 29.3L21.3 30.8L20 32.3L18.7 30.8Z" fill="#F59E0B" />

      {/* Embossed Deep Shadow Behind "<H>" */}
      <g opacity="0.7" transform="translate(0.6, 1)">
        <path
          d="M12.6 16L9.4 20L12.6 24M16 14.6V25.4M24 14.6V25.4M16 20H24M27.4 16L30.6 20L27.4 24"
          stroke="#090300"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Raised 24k Gold "< H >" Emblem */}
      <path
        d="M12.6 16L9.4 20L12.6 24"
        stroke={`url(#${emblemGrad})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 14.6V25.4M24 14.6V25.4M16 20H24"
        stroke={`url(#${emblemGrad})`}
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.4 16L30.6 20L27.4 24"
        stroke={`url(#${emblemGrad})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Spark Node on H Crossbar */}
      <circle cx="20" cy="20" r="1.2" fill="#FFFBEB" />

      {/* Animated Metallic Shimmer Sweep */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="-40" y="-10" width="40" height="60" fill={`url(#${shimmerGrad})`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="-10 0"
            to="90 0"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
}
