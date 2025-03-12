import { useEffect, useState, useMemo, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      console.log("inside useEffect");
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log("Particles Loaded:", container);
  }, []);

  const options = useMemo(() => ({
    autoPlay: true,
    background: {
      color: { value: "#ffffff" },
      opacity: 1,
    },
    fullScreen: { enable: true, zIndex: 0 },
    detectRetina: true,
    fpsLimit: 120,
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: {
          enable: true,
          mode: "grab",
          parallax: { enable: true, force: 60, smooth: 10 },
        },
        resize: { enable: true, delay: 0.5 },
      },
      modes: {
        grab: { distance: 400, links: { opacity: 1 } },
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#000000" },
      links: { color: "#000000", distance: 150, enable: true, opacity: 0.4, width: 1 },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: { default: "out" },
      },
      number: { value: 100, density: { enable: true, width: 1920, height: 1080 } },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: { enable: true, speed: 3, startValue: "random" },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 10 },
        animation: { enable: true, speed: 20, startValue: "random" },
      },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    zLayers: 100,
  }), []);

  return useMemo(() => {
    if (!init) return null;
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
  }, [init, particlesLoaded, options]); // Dependencies ensure this is only recreated when necessary
};

export default ParticlesBackground;
