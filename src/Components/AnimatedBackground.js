// import React from "react";
// import { motion } from "framer-motion";

// const AnimatedBackground = () => {
//   return (
//     <motion.div
//       initial={{ backgroundPosition: "0% 50%" }}
//       animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
//       transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         background: "linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #ffdde1)",
//         backgroundSize: "300% 300%",
//         zIndex: -1,
//       }}
//     />
//   );
// };

// export default AnimatedBackground;
import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#0e4166",
      backgroundImage: "linear-gradient(to bottom, rgba(14, 65, 102, 0.86), #0e4166)",
      zIndex: -1,
      overflow: "hidden",
    }}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="bg">
            <stop offset="0%" style={{ stopColor: "rgba(130, 158, 249, 0.06)" }}></stop>
            <stop offset="50%" style={{ stopColor: "rgba(76, 190, 255, 0.6)" }}></stop>
            <stop offset="100%" style={{ stopColor: "rgba(115, 209, 72, 0.2)" }}></stop>
          </linearGradient>
          <path
            id="wave"
            fill="url(#bg)"
            d="M-363.852,502.589c0,0,236.988-41.997,505.475,0
                s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859
                s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z"
          />
        </defs>
        <g>
          <motion.use
            xlinkHref="#wave"
            opacity="0.3"
            animate={{ x: [270, -334, 270] }}
            transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.use
            xlinkHref="#wave"
            opacity="0.6"
            animate={{ x: [-270, 243, -270] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.use
            xlinkHref="#wave"
            opacity="0.9"
            animate={{ x: [0, -140, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedBackground;