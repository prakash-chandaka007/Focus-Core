import React from 'react';

const MiniSparkline = ({ data, color = "#6366f1", className }) => {
    // data is array of numbers (e.g. [0.2, 0.5, 0.8, 0.4, 0.9])
    const width = 60;
    const height = 16;

    if (!data || data.length < 2) return null;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - (d * height)
    }));

    const pathData = points.reduce((acc, p, i) =>
        i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
        "");

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={`opacity-40 overflow-visible ${className}`}>
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-glow-pulse"
                style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
            />
        </svg>
    );
};

export default MiniSparkline;
