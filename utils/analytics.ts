// Utility functions for tracking events
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: {
      (...args: any[]): void;
      q?: any[];
      push?: (...args: any[]) => void;
      loaded?: boolean;
      version?: string;
      queue?: any[];
      callMethod?: (...args: any[]) => void;
    };
    _fbq: any;
  }
}

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
};

// Meta Pixel tracking functions
export const trackMetaEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, parameters);
  }
};

export const trackMetaCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, parameters);
  }
};

// Specific tracking functions for Google Analytics
export const trackWheelSpin = (prizeAmount?: number) => {
  trackEvent("wheel_spin", {
    event_category: "engagement",
    event_label: "spinning_wheel",
    prize_amount: prizeAmount,
  });

  // Track for Meta Pixel as custom event
  trackMetaCustomEvent("WheelSpin", {
    prize_amount: prizeAmount,
    content_category: "engagement",
    content_name: "spinning_wheel",
  });
};

export const trackEmailSubmission = (email: string, prizeAmount: number) => {
  trackEvent("email_submission", {
    event_category: "conversion",
    event_label: "email_form",
    email_domain: email.split("@")[1],
    prize_amount: prizeAmount,
  });

  // Track for Meta Pixel as Lead event (standard event)
  trackMetaEvent("Lead", {
    value: prizeAmount,
    currency: "USD",
    content_name: "email_submission",
    content_category: "conversion",
  });
};

export const trackExternalClick = (destination: string) => {
  trackEvent("external_click", {
    event_category: "engagement",
    event_label: "external_link",
    destination: destination,
  });

  // Track for Meta Pixel as custom event
  trackMetaCustomEvent("ExternalClick", {
    destination: destination,
    content_category: "engagement",
    content_name: "external_link",
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    event_category: "navigation",
    page_name: pageName,
  });

  // Meta Pixel PageView is automatically tracked, but we can send custom parameters
  trackMetaEvent("PageView", {
    content_name: pageName,
    content_category: "navigation",
  });
};

// Enhanced ecommerce tracking
export const trackPrizeWin = (prizeAmount: number) => {
  trackEvent("purchase", {
    currency: "USD",
    value: prizeAmount,
    items: [
      {
        item_id: "raffle_entry",
        item_name: "Raffle Entry",
        category: "Gaming",
        quantity: 1,
        price: prizeAmount,
      },
    ],
  });

  // Track for Meta Pixel as Purchase event
  trackMetaEvent("Purchase", {
    value: prizeAmount,
    currency: "USD",
    content_ids: ["raffle_entry"],
    content_name: "Raffle Entry",
    content_category: "Gaming",
    num_items: 1,
  });
};

// User properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "set_user_properties",
      user_properties: properties,
    });
  }
};

// Privacy and consent functions
export const updateConsentState = (granted: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
    });
  }
};

// Initialize Meta Pixel with enhanced matching
export const initMetaPixel = (
  pixelId: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }
) => {
  if (typeof window !== "undefined" && window.fbq) {
    // Initialize pixel
    window.fbq("init", pixelId, userData);

    // Track initial page view
    window.fbq("track", "PageView");
  }
};
