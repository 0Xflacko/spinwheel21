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
    // Initialize fbq function
    if (typeof window !== "undefined") {
      window.fbq =
        window.fbq ||
        function (...args: any[]) {
          (window.fbq.q = window.fbq.q || []).push(args);
        };
      window._fbq = window._fbq || window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = [];

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
