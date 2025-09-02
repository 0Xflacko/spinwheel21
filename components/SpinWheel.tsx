import React, { useState, useEffect } from "react";
import { calculatePrize } from "../utils/prizeCalculator";

interface SpinWheelProps {
  isSpinning: boolean;
  rotationDegrees: number;
  onSpinComplete?: (prizeAmount: number) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({
  isSpinning,
  rotationDegrees,
  onSpinComplete,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Reset completion flag when starting a new spin
  useEffect(() => {
    if (isSpinning) {
      setHasTriggeredCompletion(false);
    }
  }, [isSpinning]);

  // Handle spin completion and prize calculation
  useEffect(() => {
    if (
      !isSpinning &&
      onSpinComplete &&
      rotationDegrees > 0 &&
      !hasTriggeredCompletion
    ) {
      // Wait for the CSS animation to complete before calculating prize
      const timer = setTimeout(() => {
        const normalizedDegree = rotationDegrees % 360;
        const prizeAmount = calculatePrize(normalizedDegree);
        onSpinComplete(prizeAmount);
        setHasTriggeredCompletion(true);
      }, 500); // Small delay to ensure CSS animation has finished

      return () => clearTimeout(timer);
    }
  }, [isSpinning, rotationDegrees, onSpinComplete, hasTriggeredCompletion]);
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Wheel Container with proper layering */}
      <div className="relative">
        {/* Base Stand (bottom layer) */}
        <div className="relative z-10 mt-16 sm:mt-20 md:mt-24 lg:mt-28">
          <img
            src="/base/Group 427324029.svg"
            alt="Wheel Base"
            className="w-48 sm:w-48 md:w-52 lg:w-56 h-auto"
          />
        </div>

        {/* Wheel Prize (bottom layer) */}
        <div
          className="absolute left-1/2 z-20"
          style={{
            transform: "translateX(-50%)",
            top: isMobile ? "-55px" : "-75px", // Mobile vs Desktop positioning
            width: isMobile ? "220px" : "250px", // Mobile vs Desktop size
            height: isMobile ? "220px" : "250px",
          }}
        >
          <img
            src="/wheel_prize/Wheel Prize (1).svg"
            alt="Prize Wheel"
            className="w-full h-full"
            style={{
              transform: `scale(${
                isMobile ? 1.1 : 1.2
              }) rotate(${rotationDegrees}deg)`,
              transformOrigin: "center",
              transition: isSpinning
                ? "transform 10s cubic-bezier(0.25, 0.1, 0.25, 1)"
                : "none", // Add transition for spinning
            }}
          />
        </div>

        {/* Fixed Wheel (top layer, in front of wheel prize) */}
        <div
          className="absolute left-1/2 z-30"
          style={{
            transform: "translateX(-50%)",
            top: isMobile ? "-55px" : "-75px", // Mobile vs Desktop positioning
            width: isMobile ? "200px" : "240px", // Mobile vs Desktop size
            height: isMobile ? "200px" : "235px",
          }}
        >
          <img
            src="/fixed_wheel/Fixed (1).svg"
            alt="Fixed Wheel"
            className="w-full h-full"
            style={{
              transform: `scale(${isMobile ? 1.15 : 1.25})`,
              transformOrigin: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
