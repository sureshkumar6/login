"use client";

import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const neatConfig = {
    colors: [
        { color: '#FFFFFF', enabled: true },
        { color: '#EFE2CE', enabled: true },
        { color: '#D5ECEB', enabled: true },
        { color: '#E4E4E4', enabled: true },
        { color: '#F6FFFF', enabled: true },
    ],
    speed: 2,
    horizontalPressure: 4,
    verticalPressure: 5,
    waveFrequencyX: 4,
    waveFrequencyY: 3,
    waveAmplitude: 2,
    shadows: 4,
    highlights: 7,
    colorBrightness: 1,
    colorSaturation: 0,
    wireframe: false,
    colorBlending: 7,
    backgroundColor: '#00A2FF',
    backgroundAlpha: 1,
    grainScale: 100,
    grainSparsity: 0,
    grainIntensity: 0.05,
    grainSpeed: 0.3,
    resolution: 0.5,
};

const NeatBackground = ({ children }) => {
    const canvasRef = useRef(null);
    const neatInstance = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            neatInstance.current = new NeatGradient({
                ref: canvasRef.current, // Pass the <canvas> element
                ...neatConfig
            });

            return () => neatInstance.current?.destroy();
        }
    }, []);

    return (
        <div style={{ position: "fixed", width: "100vw", height: "100vh", top: 0, left: 0, zIndex: -2 }}>
            {/* Neat Gradient Canvas */}
            <canvas 
                ref={canvasRef} 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} 
            />

            {/* Glass Effect Overlay */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backdropFilter: "blur(10px) saturate(150%)", // Adjust blur strength
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight white tint
                zIndex: -1, // Keeps it behind content but above background
            }} />

            {/* Children content */}
            <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </div>
    );
};

export default NeatBackground;
