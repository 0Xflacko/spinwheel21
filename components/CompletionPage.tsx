"use client";

import React, { useState } from "react";

interface CompletionPageProps {
  prizeAmount: number;
  onRegister: () => void;
}

const CompletionPage: React.FC<CompletionPageProps> = ({
  prizeAmount,
  onRegister,
}) => {
  const [email, setEmail] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showGoodLuck, setShowGoodLuck] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && isConfirmed) {
      try {
        // Save email to Google Sheets
        const response = await fetch("/api/save-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            prizeAmount,
          }),
        });

        if (response.ok) {
          console.log("Email saved successfully to Google Sheets");
        } else {
          const errorData = await response.text();
          console.error("Failed to save email to Google Sheets:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
        }
      } catch (error) {
        console.error("Error saving email:", error);
      }

      // Show Good Luck page regardless of API success/failure
      setShowGoodLuck(true);
    }
  };

  // Good Luck Page Component
  const GoodLuckPage = () => (
    <div
      className="min-h-screen w-full flex justify-center items-center relative overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background: "var(--Black, #000)",
      }}
    >
      {/* Background with green glow effect */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 255, 0, 0.15) 0%, rgba(0, 0, 0, 0.9) 70%)",
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg z-30 min-h-screen py-8 relative text-center">
        {/* WTF Games Logo */}
        <div className="w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36 mb-12">
          <img src="/logo/logo.svg" alt="WTF Logo" className="w-full h-full" />
        </div>

        {/* Good Luck Text */}
        <div className="mb-8">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold uppercase mb-8 leading-tight"
            style={{
              color: "#00FF00",
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
              textShadow:
                "0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.4)",
            }}
          >
            GOOD LUCK!
          </h1>
        </div>

        {/* Notification Text */}
        <div className="mb-8 px-4">
          <p
            className="text-white text-lg sm:text-xl font-bold uppercase mb-2"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            WE&apos;LL NOTIFY WINNERS BY EMAIL
          </p>
          <p
            className="text-white text-base sm:text-lg font-medium uppercase"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            CHECK US OUT
          </p>
        </div>

        {/* WTFLEAGUES.COM Button */}
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              window.open("https://wtfleagues.com", "_blank");
              // Call onRegister after user clicks the button to proceed to next step
              setTimeout(() => onRegister(), 500);
            }}
            className="w-full py-4 px-6 rounded-lg font-bold text-xl uppercase transition-all text-black cursor-pointer"
            style={{
              fontFamily:
                "'Korolev', 'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
              backgroundColor: "#00FF00",
              boxShadow:
                "0 0 30px rgba(0, 255, 0, 0.6), 0 4px 15px rgba(0, 0, 0, 0.3)",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = "#00E600";
              target.style.transform = "translateY(-2px)";
              target.style.boxShadow =
                "0 0 40px rgba(0, 255, 0, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = "#00FF00";
              target.style.transform = "translateY(0px)";
              target.style.boxShadow =
                "0 0 30px rgba(0, 255, 0, 0.6), 0 4px 15px rgba(0, 0, 0, 0.3)";
            }}
          >
            WTFLEAGUES.COM
          </button>
        </div>
      </div>
    </div>
  );

  // If showing Good Luck page, render that instead
  if (showGoodLuck) {
    return <GoodLuckPage />;
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center relative overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background: "var(--Black, #000)",
      }}
    >
      {/* Background Image with Radial Gradient Overlay */}
      <div
        className="absolute opacity-full pointer-events-none inset-0"
        style={{
          backgroundImage: "url('/background_image/image 26 (Traced) (1).svg')",
          backgroundSize: "cover",
          backgroundPosition: "calc(50% - 25px) calc(50% + 30px)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "scroll",
          zIndex: 1,
        }}
      />

      {/* Blurred Hamster Background */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(90deg, #05C5FF 55.31%, #0F0 97.78%)",
          zIndex: 2,
        }}
      >
        <img
          src="/header/Desktop Banners (1).svg"
          alt="Blurred Hamster Background"
          className="w-full h-full object-cover"
          style={{
            filter: "blur(8px) brightness(0.7)",
          }}
        />
      </div>

      {/* Purple Confetti Animation - More confetti! */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Extra Large Hero Confetti - Covering logo and text area */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`hero-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${15 + (i % 4) * 20}%`,
              top: `${10 + Math.floor(i / 4) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg) scale(${
                1.2 + Math.random() * 0.8
              })`,
            }}
          >
            <img
              src="/confeti/confeti.svg"
              alt="Hero Confetti"
              className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 opacity-80"
              style={{
                animation: `float ${
                  4 + Math.random() * 2
                }s ease-in-out infinite alternate`,
                filter: "blur(0.5px)",
              }}
            />
          </div>
        ))}

        {/* Large confetti SVGs */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg) scale(${
                0.2 + Math.random() * 0.6
              })`,
            }}
          >
            <img
              src="/confeti/confeti.svg"
              alt="Confetti"
              className="w-20 h-20 opacity-70"
              style={{
                animation: `float ${
                  3 + Math.random() * 2
                }s ease-in-out infinite alternate`,
              }}
            />
          </div>
        ))}

        {/* Medium floating confetti pieces */}
        {[...Array(25)].map((_, i) => (
          <div
            key={`medium-${i}`}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full opacity-80"
              style={{
                background:
                  i % 4 === 0
                    ? "#6C3BF5"
                    : i % 4 === 1
                    ? "#9945FF"
                    : i % 4 === 2
                    ? "#05C5FF"
                    : "#00FF00",
                boxShadow: "0 0 8px currentColor",
              }}
            />
          </div>
        ))}

        {/* Small sparkle confetti */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 1}s`,
            }}
          >
            <div
              className="w-1 h-1 rounded-full opacity-90"
              style={{
                background:
                  i % 5 === 0
                    ? "#6C3BF5"
                    : i % 5 === 1
                    ? "#9945FF"
                    : i % 5 === 2
                    ? "#05C5FF"
                    : i % 5 === 3
                    ? "#00FF00"
                    : "#FFFFFF",
                boxShadow: "0 0 4px currentColor",
              }}
            />
          </div>
        ))}

        {/* Falling confetti animation */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`falling-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              animationDelay: `${Math.random() * 6}s`,
              animation: `fall ${4 + Math.random() * 3}s linear infinite`,
            }}
          >
            <div
              className="w-2 h-6 opacity-70"
              style={{
                background: `linear-gradient(45deg, ${
                  i % 3 === 0 ? "#6C3BF5" : i % 3 === 1 ? "#9945FF" : "#05C5FF"
                }, transparent)`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}

        {/* Corner and Edge Large Confetti - Strategic positioning */}
        {/* Top corners */}
        <div
          className="absolute animate-pulse"
          style={{
            left: "5%",
            top: "5%",
            animationDelay: "0.5s",
            animationDuration: "4s",
            transform: "rotate(45deg) scale(1.5)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Corner Confetti"
            className="w-32 h-32 opacity-70"
            style={{
              animation: "float 5s ease-in-out infinite alternate",
            }}
          />
        </div>

        <div
          className="absolute animate-pulse"
          style={{
            right: "5%",
            top: "8%",
            animationDelay: "1s",
            animationDuration: "3.5s",
            transform: "rotate(-30deg) scale(1.3)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Corner Confetti"
            className="w-36 h-36 opacity-75"
            style={{
              animation: "float 4.5s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Side confetti */}
        <div
          className="absolute animate-pulse"
          style={{
            left: "2%",
            top: "40%",
            animationDelay: "2s",
            animationDuration: "4.5s",
            transform: "rotate(120deg) scale(1.4)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Side Confetti"
            className="w-28 h-28 opacity-65"
            style={{
              animation: "float 6s ease-in-out infinite alternate",
            }}
          />
        </div>

        <div
          className="absolute animate-pulse"
          style={{
            right: "3%",
            top: "45%",
            animationDelay: "1.5s",
            animationDuration: "3.8s",
            transform: "rotate(-45deg) scale(1.6)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Side Confetti"
            className="w-30 h-30 opacity-70"
            style={{
              animation: "float 5.5s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Bottom area confetti */}
        <div
          className="absolute animate-pulse"
          style={{
            left: "8%",
            bottom: "15%",
            animationDelay: "0.8s",
            animationDuration: "4.2s",
            transform: "rotate(75deg) scale(1.3)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Bottom Confetti"
            className="w-24 h-24 opacity-60"
            style={{
              animation: "float 4.8s ease-in-out infinite alternate",
            }}
          />
        </div>

        <div
          className="absolute animate-pulse"
          style={{
            right: "10%",
            bottom: "20%",
            animationDelay: "2.5s",
            animationDuration: "3.2s",
            transform: "rotate(-60deg) scale(1.7)",
          }}
        >
          <img
            src="/confeti/confeti.svg"
            alt="Bottom Confetti"
            className="w-26 h-26 opacity-75"
            style={{
              animation: "float 5.2s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          from {
            transform: translateY(0px) rotate(0deg);
          }
          to {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes fall {
          from {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-lg z-30 min-h-screen py-8 relative">
        {/* WTF Games Logo */}
        <div className="w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36 mb-8">
          <img src="/logo/logo.svg" alt="WTF Logo" className="w-full h-full" />
        </div>

        {/* Congratulations Text - Better Centered */}
        <div className="text-center mb-12 px-4">
          <h1
            className="text-white text-3xl sm:text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight text-center"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            YOU WON A
          </h1>
          <div
            className="text-6xl sm:text-6xl md:text-7xl font-bold uppercase mb-4 leading-tight text-center"
            style={{
              color: "#00FF00",
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
              textShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
            }}
          >
            ${prizeAmount} USDC
          </div>
          <div
            className="text-white text-2xl sm:text-2xl md:text-3xl font-bold uppercase leading-tight"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
              textAlign: "center",
              paddingLeft: "2rem",
            }}
          >
            RAFFLE TICKET! 🚀
          </div>
        </div>

        {/* Age Confirmation - Always visible and centered */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-center">
            <label className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
                    isConfirmed
                      ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/50"
                      : "bg-transparent border-gray-400 hover:border-gray-300"
                  }`}
                >
                  {isConfirmed && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-300 text-lg sm:text-lg md:text-xl ml-4 font-medium">
                I CONFIRM I AM 18+ YEARS OF AGE
              </span>
            </label>
          </div>
        </div>

        {/* Registration Section */}
        <div
          className={`w-full max-w-lg transition-all duration-300 ${
            !isConfirmed
              ? "blur-sm opacity-50 pointer-events-none"
              : "blur-none opacity-100"
          }`}
        >
          <h2
            className="text-white text-xl sm:text-xl md:text-2xl font-bold uppercase text-center mb-4"
            style={{
              fontFamily:
                "'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
            }}
          >
            REGISTER YOUR DETAILS
          </h2>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg text-center mb-6">
            We collect your email to send you updates about the&nbsp;raffle
            <br />
            we will not contact you for marketing purposes
          </p>

          {/* Email Form - Centered and Improved */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-6 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none text-center text-lg"
                style={{
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = "#00FF00";
                  target.style.boxShadow = "0 0 0 2px rgba(0, 255, 0, 0.2)";
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = "#4B5563";
                  target.style.boxShadow = "none";
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!email || !isConfirmed}
              className={`w-full py-4 px-6 rounded-lg font-bold text-xl sm:text-xl md:text-2xl uppercase transition-all ${
                email && isConfirmed
                  ? "text-black cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
              style={{
                fontFamily:
                  "'Korolev', 'Roboto Condensed', 'Arial Black', 'Arial', sans-serif",
                ...(email && isConfirmed
                  ? {
                      backgroundColor: "#00FF00",
                      boxShadow:
                        "0 0 20px rgba(0, 255, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.2)",
                    }
                  : {}),
              }}
              onMouseEnter={(e) => {
                if (email && isConfirmed) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "#00E600";
                  target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (email && isConfirmed) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "#00FF00";
                  target.style.transform = "translateY(0px)";
                }
              }}
            >
              REGISTER & ENTER RAFFLE
            </button>
          </form>
        </div>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-8">
          <a href="#" className="text-gray-400 hover:text-white">
            <img src="/instagram (1).svg" alt="Instagram" className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <img src="/instagram.svg" alt="Instagram" className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <img src="/tiktok.svg" alt="TikTok" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
