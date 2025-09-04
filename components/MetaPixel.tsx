"use client";

import { useEffect } from "react";
import Script from "next/script";

interface MetaPixelProps {
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

const MetaPixel: React.FC<MetaPixelProps> = ({ userData }) => {
  const pixelId = "1121412753276579"; // Hardcoded Meta Pixel ID
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      // Initialize pixel with enhanced matching
      window.fbq("init", pixelId, userData);
      window.fbq("track", "PageView");
    }
  }, [userData]);

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        src={`https://connect.facebook.net/en_US/fbevents.js`}
      />

      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default MetaPixel;
