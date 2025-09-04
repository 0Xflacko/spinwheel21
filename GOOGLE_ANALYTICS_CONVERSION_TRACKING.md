# Google Analytics & Tag Manager Conversion Tracking Setup

## Overview

//change domain first
This guide will help you set up comprehensive conversion tracking for your spinning wheel landing page to measure:

- **Page Views**: How many people visit your landing page
- **Wheel Spins**: How many users engage with the spinning wheel
- **Email Submissions**: How many users complete the email form (primary conversion)
- **External Clicks**: How many users click through to wtfleagues.com

## Prerequisites

- Google Account
- Access to your website/domain
- Basic understanding of HTML/JavaScript

---

## Step 1: Create Google Analytics 4 (GA4) Property

### 1.1 Set up Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an Account name (e.g., "WTF Games Marketing")
4. Configure data sharing settings as desired
5. Click "Next"

### 1.2 Create Property

1. Property name: "WTF Games Spin Wheel"
2. Select your timezone and currency
3. Click "Next"

### 1.3 Business Information

1. Select your industry category
2. Choose business size
3. Select how you plan to use Analytics
4. Click "Create"

### 1.4 Accept Terms of Service

1. Select your country
2. Accept Google Analytics Terms of Service
3. Accept Google Measurement Terms of Service

---

## Step 2: Set up Google Tag Manager (GTM)

### 2.1 Create GTM Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Account Name: "WTF Games"
4. Container Name: Your website domain (e.g., "wtfgames.com")
5. Target Platform: "Web"
6. Click "Create"

### 2.2 Install GTM Container

1. Copy the GTM container code provided
2. Add the first script to your `<head>` section
3. Add the second script immediately after opening `<body>` tag

**For Next.js Implementation:**

Create `components/GoogleTagManager.tsx`:

```tsx
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleTagManager = ({ gtmId }: { gtmId: string }) => {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // GTM script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script1);

    // Initialize GTM
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
  }, [gtmId]);

  return (
    <>
      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
};

export default GoogleTagManager;
```

Add to your `app/layout.tsx`:

```tsx
import GoogleTagManager from "@/components/GoogleTagManager";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleTagManager gtmId="GTM-XXXXXXX" />
        {children}
      </body>
    </html>
  );
}
```

---

## Step 3: Configure GA4 in Google Tag Manager

### 3.1 Create GA4 Configuration Tag

1. In GTM, click "Tags" → "New"
2. Tag Name: "GA4 Configuration"
3. Tag Type: "Google Analytics: GA4 Configuration"
4. Measurement ID: Your GA4 Measurement ID (GA4-XXXXXXXXXX)
5. Trigger: "All Pages"
6. Save

### 3.2 Test the Setup

1. Click "Preview" in GTM
2. Enter your website URL
3. Verify the GA4 tag fires on page load
4. Check real-time reports in GA4

---

## Step 4: Set up Custom Events for Conversion Tracking

### 4.1 Create Custom Events in Your Code

Add these event tracking functions to your components:

**Create `utils/analytics.ts`:**

```typescript
// Utility functions for tracking events
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

// Specific tracking functions
export const trackWheelSpin = (prizeAmount?: number) => {
  trackEvent("wheel_spin", {
    event_category: "engagement",
    event_label: "spinning_wheel",
    prize_amount: prizeAmount,
  });
};

export const trackEmailSubmission = (email: string, prizeAmount: number) => {
  trackEvent("email_submission", {
    event_category: "conversion",
    event_label: "email_form",
    email_domain: email.split("@")[1],
    prize_amount: prizeAmount,
  });
};

export const trackExternalClick = (destination: string) => {
  trackEvent("external_click", {
    event_category: "engagement",
    event_label: "external_link",
    destination: destination,
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    event_category: "navigation",
    page_name: pageName,
  });
};
```

### 4.2 Implement Tracking in Your Components

**Update `app/page.tsx`:**

```typescript
import { trackWheelSpin, trackPageView } from "@/utils/analytics";

export default function Home() {
  // ... existing code ...

  useEffect(() => {
    trackPageView("landing_page");
  }, []);

  const handleSpinClick = () => {
    if (!isSpinning) {
      trackWheelSpin(); // Track when user clicks spin
      setIsSpinning(true);
      // ... rest of existing code ...
    }
  };

  const handleSpinComplete = (amount: number) => {
    trackWheelSpin(amount); // Track completed spin with prize
    setPrizeAmount(amount);
    // ... rest of existing code ...
  };

  // ... rest of component
}
```

**Update `components/CompletionPage.tsx`:**

```typescript
import {
  trackEmailSubmission,
  trackExternalClick,
  trackPageView,
} from "@/utils/analytics";

const CompletionPage: React.FC<CompletionPageProps> = ({
  prizeAmount,
  onRegister,
}) => {
  // ... existing code ...

  useEffect(() => {
    trackPageView("completion_page");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && isConfirmed) {
      // Track email submission
      trackEmailSubmission(email, prizeAmount);

      // ... existing API call code ...

      setShowGoodLuck(true);
    }
  };

  // In the GoodLuckPage component, update the button click:
  const GoodLuckPage = () => (
    // ... existing JSX ...
    <button
      onClick={() => {
        trackExternalClick("wtfleagues.com");
        window.open("https://wtfleagues.com", "_blank");
        setTimeout(() => onRegister(), 500);
      }}
      // ... existing props ...
    >
      WTFLEAGUES.COM
    </button>
    // ... rest of component
  );
};
```

---

## Step 5: Create GTM Triggers and Tags

### 5.1 Create Custom Event Triggers

**Wheel Spin Trigger:**

1. GTM → Triggers → New
2. Name: "Wheel Spin Event"
3. Trigger Type: "Custom Event"
4. Event Name: "wheel_spin"
5. Save

**Email Submission Trigger:**

1. GTM → Triggers → New
2. Name: "Email Submission Event"
3. Trigger Type: "Custom Event"
4. Event Name: "email_submission"
5. Save

**External Click Trigger:**

1. GTM → Triggers → New
2. Name: "External Click Event"
3. Trigger Type: "Custom Event"
4. Event Name: "external_click"
5. Save

### 5.2 Create GA4 Event Tags

**Wheel Spin Tag:**

1. GTM → Tags → New
2. Name: "GA4 - Wheel Spin"
3. Tag Type: "Google Analytics: GA4 Event"
4. Configuration Tag: Select your GA4 Configuration tag
5. Event Name: "wheel_spin"
6. Event Parameters:
   - `engagement_time_msec`: 1000
   - `prize_amount`: `{{Event - prize_amount}}`
7. Trigger: "Wheel Spin Event"
8. Save

**Email Submission Tag:**

1. GTM → Tags → New
2. Name: "GA4 - Email Submission"
3. Tag Type: "Google Analytics: GA4 Event"
4. Configuration Tag: Select your GA4 Configuration tag
5. Event Name: "email_submission"
6. Event Parameters:
   - `email_domain`: `{{Event - email_domain}}`
   - `prize_amount`: `{{Event - prize_amount}}`
7. Trigger: "Email Submission Event"
8. Save

**External Click Tag:**

1. GTM → Tags → New
2. Name: "GA4 - External Click"
3. Tag Type: "Google Analytics: GA4 Event"
4. Configuration Tag: Select your GA4 Configuration tag
5. Event Name: "external_click"
6. Event Parameters:
   - `destination`: `{{Event - destination}}`
7. Trigger: "External Click Event"
8. Save

---

## Step 6: Set up Conversions in GA4

### 6.1 Mark Events as Conversions

1. Go to GA4 → Events
2. Find your custom events (wheel_spin, email_submission, external_click)
3. Toggle "Mark as conversion" for the events you want to track as conversions
4. Typically, mark `email_submission` as your primary conversion

### 6.2 Create Custom Conversions

1. GA4 → Configure → Conversions
2. Click "New conversion event"
3. Event Name: "qualified_lead" (for users who both spin and submit email)
4. Set conditions as needed

---

## Step 7: Create Goals and Audiences

### 7.1 Create Audiences

**Engaged Users:**

- Users who triggered "wheel_spin" event

**High-Intent Users:**

- Users who completed "email_submission"

**Complete Funnel Users:**

- Users who completed all three events

### 7.2 Set up Funnels

1. GA4 → Explore → Funnel Exploration
2. Create funnel steps:
   - Step 1: Page view (landing page)
   - Step 2: wheel_spin event
   - Step 3: email_submission event
   - Step 4: external_click event

---

## Step 8: Testing and Validation

### 8.1 Test All Events

1. Use GTM Preview mode
2. Go through the complete user journey
3. Verify all events fire correctly
4. Check GA4 Real-time reports

### 8.2 Validation Checklist

- [ ] Page views tracked correctly
- [ ] Wheel spin events firing
- [ ] Email submission events firing
- [ ] External click events firing
- [ ] All events appear in GA4
- [ ] Conversions are being recorded

---

## Step 9: Create Reports and Dashboards

### 9.1 Key Metrics to Track

- **Traffic Sources**: Where users come from
- **Conversion Rate**: Email submissions / Page views
- **Engagement Rate**: Wheel spins / Page views
- **Click-through Rate**: External clicks / Email submissions
- **Cost per Conversion**: Ad spend / Email submissions

### 9.2 Custom Reports

Create reports for:

- Daily conversion tracking
- Traffic source performance
- User behavior flow
- Prize amount impact on conversions

---

## Step 10: Advanced Tracking (Optional)

### 10.1 Enhanced Ecommerce

Track the "prize value" as ecommerce value:

```typescript
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
};
```

### 10.2 User Properties

Track user characteristics:

```typescript
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "set_user_properties",
      user_properties: properties,
    });
  }
};
```

---

## Troubleshooting

### Common Issues:

1. **Events not firing**: Check browser console for errors
2. **GTM not loading**: Verify container ID is correct
3. **GA4 not receiving data**: Check Measurement ID
4. **Real-time data not showing**: Allow up to 30 minutes for processing

### Debug Tools:

- GTM Preview Mode
- GA4 DebugView
- Browser Developer Tools
- Google Tag Assistant

---

## Privacy and Compliance

### GDPR/Privacy Considerations:

- Implement cookie consent banner
- Allow users to opt-out of tracking
- Update privacy policy
- Consider using Google Consent Mode

### Example Consent Implementation:

```typescript
export const updateConsentState = (granted: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: granted ? "granted" : "denied",
    });
  }
};
```

---

## Next Steps

1. **Set up the tracking code** following this guide
2. **Test thoroughly** before launching ads
3. **Create baseline measurements** with organic traffic
4. **Launch your ad campaigns** with UTM parameters
5. **Monitor and optimize** based on the data

This setup will give you comprehensive insights into your ad performance and user behavior, helping you optimize your campaigns for better ROI.
