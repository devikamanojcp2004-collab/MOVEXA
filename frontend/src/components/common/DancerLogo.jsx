import React from 'react';

const DancerLogo = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="currentColor"
        >
            {/* Head */}
            <circle cx="50" cy="15" r="7" />

            {/* Graceful Torso */}
            <path d="M47,24 C55,30 46,45 50,55 L42,50 C40,40 43,30 47,24 Z" />

            {/* Tutu/Classical skirt */}
            <path d="M35,48 C25,45 20,50 25,55 C35,60 65,60 75,55 C80,50 75,45 65,48 C55,50 45,50 35,48 Z" />

            {/* Arabesque Arm Up */}
            <path d="M47,26 C35,22 30,15 28,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Arabesque Arm Side */}
            <path d="M52,28 C65,25 75,30 85,35" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Ballet Leg En Pointe (Standing) */}
            <path d="M48,55 C45,65 48,80 48,95 L45,95 C45,80 42,65 42,55 Z" />
            <path d="M48,95 C50,95 52,90 52,90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

            {/* Ballet Leg Extended Back (Arabesque) */}
            <path d="M52,53 C60,50 70,45 80,45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M80,45 C85,45 90,43 95,40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
};

export default DancerLogo;
