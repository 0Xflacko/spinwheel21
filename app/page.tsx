"use client";

import React, { useState, useEffect } from "react";
import SpinWheel from "../components/SpinWheel";
import CompletionPage from "../components/CompletionPage";

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [hamsterState, setHamsterState] = useState("fattie"); // 'fattie', 'hamrun', 'drip'
  const [isStopping, setIsStopping] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile

  const handleSpinClick = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setHamsterState("hamrun"); // Change to hamrun when spin starts
      const randomDegrees = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 full rotations
      setRotationDegrees(randomDegrees);

      setTimeout(() => {
        setIsSpinning(false);
        setIsStopping(true); // Set isStopping to true when spinning stops
      }, 10000); // Stop after 10 seconds
    }
  };

  const handleSpinComplete = (amount: number) => {
    setPrizeAmount(amount);
    setHamsterState("drip"); // Change to drip when spin completes
    setIsStopping(false); // Reset isStopping
    // Show completion page after a short delay
    setTimeout(() => {
      setShowCompletion(true);
    }, 1000);
  };

  const handleRegister = () => {
    // Handle registration logic here
    console.log(`User registered for $${prizeAmount} USDC raffle`);
    // You can add API calls, form validation, etc.
  };

  const handleMobileChange = (mobile: boolean) => {
    // Callback to update isMobile
    setIsMobile(mobile);
  };

  // Remove this effect - let the SpinWheel handle the final rotation calculation

  // Show completion page if spin is complete
  if (showCompletion) {
    return (
      <CompletionPage prizeAmount={prizeAmount} onRegister={handleRegister} />
    );
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center items-start relative overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        paddingTop: "60px",
        background: "var(--Black, #000)",
      }}
    >
      {/* Background Image with Radial Gradient Overlay */}
      <div
        className="absolute opacity-full pointer-events-none inset-0"
        style={{
          backgroundImage: "url('/background_image/image 26 (Traced) (1).svg')",
          backgroundSize: "cover",
          backgroundPosition: "calc(50% - 25px) calc(50% + 30px)", // Shift 10px left, 10px down
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          zIndex: 1,
        }}
      ></div>
      {/* Header with diagonal stripes - positioned at the very top */}
      <div
        className="absolute top-0 left-0 w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.90) 0%, rgba(0, 0, 0, 0.90) 100%), linear-gradient(90deg, #05C5FF 55.31%, #0F0 97.78%)",
        }}
      >
        <img
          src="/header/Desktop Banners (1).svg"
          alt="Header Banner"
          className="w-full h-full object-cover"
        />

        {/* WTF Games Logo and Text positioned over the header */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 sm:-translate-y-1/2 flex flex-col items-center px-0 sm:px-4 z-20">
          {/* WTF Logo */}
          <div className="w-48 h-36 sm:w-48 sm:h-36 md:w-56 md:h-42 lg:w-64 lg:h-48">
            <img
              src="/logo/logo.svg"
              alt="WTF Logo"
              className="w-full h-full"
            />
          </div>

          {/* Header Text */}
          <div
            className="w-screen sm:w-full sm:max-w-sm md:max-w-lg lg:max-w-xl text-center mt-2 sm:mt-4 px-0 sm:px-0"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            <div className="text-white text-xl sm:text-xl md:text-xl lg:text-2xl font-bold uppercase leading-tight">
              WIN AN ENTRY INTO ONE OF OUR FREE
            </div>
            <div className="text-xl sm:text-xl md:text-xl lg:text-2xl font-bold uppercase leading-tight">
              <span style={{ color: "#00FF00" }}>PRIZE RAFFLES</span>
              <span className="text-white"> - JUST SPIN!</span>
            </div>

            {/* Prize Draw Date */}
            <div
              className="opacity-70 text-center text-white text-xs sm:text-sm font-medium leading-none mt-2 sm:mt-3"
              style={{
                fontFamily:
                  "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
              }}
            >
              PRIZE DRAW DATE
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mt-72 sm:mt-64 md:mt-72 lg:mt-88 xl:mt-104 pt-4 sm:pt-8 md:pt-2 relative">
        {/* Hamster Image */}
        <div
          className={`absolute z-40 ${
            hamsterState === "fattie" ? "block" : "hidden"
          }`}
          style={{
            left: "50%",
            top: isMobile ? "0px" : "-25px", // Moved further down
            transform: "translateX(-50%)", // Centered horizontally
            width: isMobile ? "200px" : "250px", // Increased size
            height: isMobile ? "200px" : "250px", // Increased size
          }}
        >
          <img
            src="/hamsta/fattie.png"
            alt="Fattie Hamster"
            className="w-full h-full object-contain"
          />
        </div>

        <div
          className={`absolute z-40 ${
            hamsterState === "hamrun" ? "block" : "hidden"
          }`}
          style={{
            left: "50%",
            top: isMobile ? "0px" : "-40px", // Moved further down
            transform: "translateX(-50%)", // Centered horizontally
            width: isMobile ? "200px" : "250px", // Increased size
            height: isMobile ? "200px" : "250px", // Increased size
          }}
        >
          <img
            src="/hamsta/hamrun.png"
            alt="Running Hamster"
            className="w-full h-full object-contain"
          />
        </div>

        <div
          className={`absolute z-40 ${
            hamsterState === "drip" ? "block" : "hidden"
          }`}
          style={{
            left: "50%",
            top: isMobile ? "-40px" : "-25px", // Moved further down
            transform: "translateX(-50%)", // Centered horizontally
            width: isMobile ? "200px" : "250px", // Increased size
            height: isMobile ? "200px" : "250px", // Increased size
          }}
        >
          <img
            src="/hamsta/Ham_drip.png"
            alt="Drip Hamster"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Spin Wheel */}
        <SpinWheel
          isSpinning={isSpinning}
          rotationDegrees={rotationDegrees}
          onSpinComplete={handleSpinComplete}
          onMobileChange={handleMobileChange} // Pass the handler to SpinWheel
        />

        {/* Spin Button */}
        <div
          data-size="Large"
          data-state={isSpinning ? "Disabled" : "Primary"}
          data-type="Primary"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80 py-3 sm:py-4 px-4 sm:px-6 rounded-lg inline-flex justify-center items-center gap-4 mt-8 sm:mt-10 md:mt-12 lg:mt-6 mb-6 sm:mb-8 cursor-pointer"
          style={{ backgroundColor: "#00FF00" }}
          onClick={handleSpinClick}
        >
          <div
            className="text-center justify-center text-black text-lg sm:text-xl md:text-2xl font-bold leading-normal"
            style={{
              fontFamily:
                "'Korolev', 'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            SPIN THE WHEEL
          </div>
        </div>

        {/* Footer Content */}
        <div className="flex flex-col items-center justify-center text-white px-4">
          <p
            className="text-white text-base sm:text-sm md:text-base font-medium uppercase mb-3 sm:mb-4 text-center"
            style={{
              fontFamily:
                "'Korolev', 'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            Home of the world famous
          </p>
          <div className="flex justify-center mb-4 sm:mb-3 z-20">
            <img
              src="/leagues/leagues.svg"
              alt="Leagues Logo"
              className="h-10 sm:h-8 md:h-10"
            />
          </div>
          <div className="flex gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <a
              href="https://www.youtube.com/@WTFLeagues/featured"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/instagram (1).svg"
                alt="Instagram"
                className="h-5 sm:h-6 md:h-7"
              />
            </a>
            <a
              href="https://www.instagram.com/wtfleagues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/instagram.svg"
                alt="Instagram"
                className="h-5 sm:h-6 md:h-7"
              />
            </a>
            <a
              href="https://x.com/WTFLeagues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/twitter.svg"
                alt="Twitter"
                className="h-5 sm:h-6 md:h-7"
              />
            </a>
            <a
              href="https://www.tiktok.com/@wtfleagues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/tiktok.svg"
                alt="TikTok"
                className="h-5 sm:h-6 md:h-7"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
