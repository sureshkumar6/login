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
    "autoPlay": true,
    "background": {
      "color": { "value": "#0d47a1" },
      "image": "",
      "position": "50% 50%",
      "repeat": "no-repeat",
      "size": "cover",
      "opacity": 1
    },
    "backgroundMask": {
      "composite": "destination-out",
      "cover": { "opacity": 1, "color": { "value": "" } },
      "enable": false
    },
    "clear": true,
    "fullScreen": { "enable": true, "zIndex": 0 },
    "detectRetina": true,
    "fpsLimit": 120,
    "interactivity": {
      "detectsOn": "window",
      "events": {
        "onClick": { "enable": true, "mode": ["push", "repulse"]  },
        "onHover": { "enable": true, "mode": ["attract", "bubble", "slow"]  },
        "resize": { "enable": true, "delay": 0.5 }
      },
      "modes": {
        "repulse": { "distance": 200, "duration": 0.4 }
      }
    },
    "particles": {
      "color": { "value": "#ffffff" },
      "links": { "color": "#ffffff", "distance": 150, "enable": true, "opacity": 0.4, "width": 1 },
      "move": { "enable": true, "speed": 2, "direction": "none", "outModes": { "default": "out" } },
      "number": { "value": 80, "density": { "enable": true, "width": 1920, "height": 1080 } },
      "opacity": { "value": { "min": 0.1, "max": 0.5 }, "animation": { "enable": true, "speed": 1, "startValue": "random" } },
      "shape": { "type": "image", "options": { "image": [ { "src": "/logoonlyr.png", "width": 100, "height": 100, "replaceColor": true } ] } },
      "size": { "value": 16 }
    },
    "pauseOnBlur": true,
    "pauseOnOutsideViewport": true,
    "zLayers": 100
  }), []);

  return useMemo(() => {
    if (!init) return null;
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
  }, [init, particlesLoaded, options]);
};

export default ParticlesBackground;
