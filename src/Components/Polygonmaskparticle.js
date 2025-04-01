import { useEffect, useState, useMemo, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Polygonmaskparticle = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log("Particles Loaded:", container);
  }, []);

  const options = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: { value: "#ffffff" },
        image: "",
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover",
        opacity: 1,
      },
      fullScreen: { enable: true, zIndex: 0 },
      detectRetina: true,
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onClick: { enable: false, mode: "push" },
          onHover: { enable: true, mode: "bubble" },
          resize: { enable: true, delay: 0.5 },
        },
        modes: {
          bubble: { distance: 40, duration: 2, opacity: 8, size: 6 },
          grab: { distance: 400, links: { opacity: 1 } },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: ["#4285f4", "#34A853", "#FBBC05", "#EA4335"] },
        links: { color: "random", distance: 40, enable: true, opacity: 1, width: 1 },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          outModes: { default: "bounce" },
        },
        number: { value: 200, density: { enable: true, width: 1920, height: 1080 } },
        opacity: { value: { min: 0.05, max: 0.4 }, animation: { enable: true, speed: 2 } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 10 }, animation: { enable: true, speed: 5 } },
      },
      polygon: {
        draw: {
          enable: true,
          stroke: { color: { value: "#fff" }, width: 0.5, opacity: 0.2 },
        },
        enable: true,
        inline: { arrangement: "equidistant" },
        move: { radius: 10, type: "path" },
        scale: 1,
        type: "inline",
        url: "https://particles.js.org/images/google.svg",
        position: { x: 30, y: 30 },
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      zLayers: 100,
    }),
    []
  );

  return useMemo(() => {
    if (!init) return null;
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
  }, [init, particlesLoaded, options]);
};

export default Polygonmaskparticle;
