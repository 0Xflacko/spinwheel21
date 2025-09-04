# Meta (Facebook) Conversion Tracking Setup Guide

## Overview

This guide will help you set up comprehensive Meta (Facebook) conversion tracking for your spinning wheel landing page. This setup will work alongside your existing Google Analytics tracking to provide complete visibility into your ad performance.

## Prerequisites

- Meta Business Manager account
- Meta Ads Manager access
- Your website domain verified in Meta Business Manager
- Basic understanding of Meta Pixel and Conversions API

---

## Step 1: Create Meta Pixel

### 1.1 Access Events Manager

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager**
3. Click **Connect Data Sources** → **Web** → **Meta Pixel**
4. Click **Get Started**

### 1.2 Create Your Pixel

1. **Pixel Name**: "WTF Games Spin Wheel Pixel"
2. **Website URL**: Your domain (e.g., https://yourdomain.com)
3. Click **Create Pixel**
4. Copy your **Pixel ID** (you'll need this later)

### 1.3 Choose Integration Method

**Recommended**: Use the code integration we've already implemented in your project.

---

## Step 2: Environment Configuration

### 2.1 Add Environment Variables

Add these to your `.env.local` file:

```env
# Meta Pixel Configuration
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here

# Meta Conversions API (for server-side tracking)
META_ACCESS_TOKEN=your_access_token_here
META_PIXEL_ID=your_pixel_id_here
```

### 2.2 Vercel Environment Variables

If deploying to Vercel, add these environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_META_PIXEL_ID`: Your Meta Pixel ID
   - `META_ACCESS_TOKEN`: Your Meta access token
   - `META_PIXEL_ID`: Your Meta Pixel ID (same as above, for server-side)

---

## Step 3: Dataset Quality API Setup

### 3.1 Why Choose "Set up with Dataset Quality API"

Based on your current setup, you should choose **"Set up with Dataset Quality API"** because:

1. **Enhanced Performance Monitoring**: Get detailed metrics on event match rates
2. **Better Attribution**: Improved attribution modeling for conversions
3. **Advanced Insights**: More detailed reporting on ad performance
4. **Future-Proofing**: Meta's recommended approach for serious advertisers
5. **Minimal Additional Complexity**: Since you're already implementing tracking

### 3.2 Generate Access Token

1. In Events Manager, go to your pixel
2. Click **Settings** → **Generate Access Token**
3. Select permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
4. Copy the access token and add to your environment variables

---

## Step 4: Configure Conversion Events

### 4.1 Standard Events (Recommended)

We've implemented these standard Meta events:

#### 1. **PageView** (Automatic)

- Tracks when users visit your landing page
- Automatically fired by Meta Pixel

#### 2. **Lead** (Primary Conversion)

- Tracks email submissions
- Fired when users complete the email form
- **Value**: Prize amount in USD

#### 3. **Purchase** (Enhanced Tracking)

- Tracks prize wins as purchases
- Fired when users win a prize
- **Value**: Prize amount in USD

### 4.2 Custom Events

We've also implemented custom events:

#### 1. **WheelSpin**

- Tracks wheel engagement
- Custom event for funnel analysis

#### 2. **ExternalClick**

- Tracks clicks to wtfleagues.com
- Measures post-conversion engagement

---

## Step 5: Event Implementation

### 5.1 Current Implementation

The tracking is already implemented in your codebase:

- **Meta Pixel Component**: `components/MetaPixel.tsx`
- **Analytics Utilities**: `utils/analytics.ts`
- **Layout Integration**: `app/layout.tsx`

### 5.2 Event Mapping

| User Action    | GA4 Event          | Meta Event      | Event Type |
| -------------- | ------------------ | --------------- | ---------- |
| Page Load      | `page_view`        | `PageView`      | Standard   |
| Wheel Spin     | `wheel_spin`       | `WheelSpin`     | Custom     |
| Email Submit   | `email_submission` | `Lead`          | Standard   |
| Prize Win      | `purchase`         | `Purchase`      | Standard   |
| External Click | `external_click`   | `ExternalClick` | Custom     |

---

## Step 6: Website Events Setup

### 6.1 In Meta Events Manager

1. Go to **Events Manager** → Your Pixel
2. Click **Test Events** to verify implementation
3. Navigate through your website to test events
4. Verify these events are firing:
   - PageView
   - Lead
   - Purchase
   - WheelSpin (Custom)
   - ExternalClick (Custom)

### 6.2 Event Parameters

Each event includes relevant parameters:

**Lead Event Parameters:**

- `value`: Prize amount
- `currency`: "USD"
- `content_name`: "email_submission"
- `content_category`: "conversion"

**Purchase Event Parameters:**

- `value`: Prize amount
- `currency`: "USD"
- `content_ids`: ["raffle_entry"]
- `content_name`: "Raffle Entry"
- `content_category`: "Gaming"
- `num_items`: 1

---

## Step 7: App Events (If Applicable)

### 7.1 Mobile App Consideration

Since your current implementation is web-based, app events aren't immediately necessary. However, if you plan to create a mobile app:

1. Install Meta SDK for your platform (iOS/Android)
2. Implement the same event structure
3. Use App Events in Events Manager

### 7.2 Future Mobile Implementation

When you create a mobile app, track these events:

- App Install
- App Launch
- Wheel Spin
- Lead (Email Submission)
- Purchase (Prize Win)

---

## Step 8: Offline Events Setup

### 8.1 Server-Side Tracking Implementation

Create a server-side tracking system for better data quality:

```typescript
// lib/metaConversionsAPI.ts
import crypto from "crypto";

interface ConversionEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string; // email (hashed)
    ph?: string; // phone (hashed)
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
  };
  event_source_url?: string;
  action_source: "website";
}

export async function sendMetaConversion(event: ConversionEvent) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error("Meta Pixel ID or Access Token not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [event],
          access_token: accessToken,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log("Meta conversion sent successfully:", result);
      return true;
    } else {
      console.error("Meta conversion failed:", result);
      return false;
    }
  } catch (error) {
    console.error("Error sending Meta conversion:", error);
    return false;
  }
}

// Hash user data for privacy
export function hashUserData(data: string): string {
  return crypto
    .createHash("sha256")
    .update(data.toLowerCase().trim())
    .digest("hex");
}
```

### 8.2 Integrate Server-Side Tracking

Update your email submission API to include server-side tracking:

```typescript
// In your API route (app/api/save-email/route.ts)
import { sendMetaConversion, hashUserData } from "@/lib/metaConversionsAPI";

// After successful email save
await sendMetaConversion({
  event_name: "Lead",
  event_time: Math.floor(Date.now() / 1000),
  user_data: {
    em: hashUserData(email),
    client_ip_address: clientIP,
    client_user_agent: userAgent,
  },
  custom_data: {
    value: prizeAmount,
    currency: "USD",
    content_name: "email_submission",
    content_category: "conversion",
  },
  event_source_url: request.headers.get("referer") || "",
  action_source: "website",
});
```

---

## Step 9: Conversion Configuration

### 9.1 Set Up Conversions in Ads Manager

1. Go to **Ads Manager** → **Measure & Report** → **Conversions**
2. Click **Create** → **Website**
3. Select your pixel
4. Choose conversion events:
   - **Lead** (Primary conversion)
   - **Purchase** (Secondary conversion)

### 9.2 Conversion Values

Set appropriate conversion values:

- **Lead**: Use dynamic value (prize amount) or average prize value
- **Purchase**: Use actual prize amount

### 9.3 Attribution Settings

Configure attribution windows:

- **Click-through**: 7 days (recommended)
- **View-through**: 1 day (recommended)

---

## Step 10: Testing and Validation

### 10.1 Test Events

1. **Meta Events Manager Test**:

   - Go to Events Manager → Test Events
   - Enter your website URL
   - Complete user journey
   - Verify all events fire correctly

2. **Meta Pixel Helper**:
   - Install Meta Pixel Helper browser extension
   - Navigate through your site
   - Check for pixel firing and event parameters

### 10.2 Validation Checklist

- [ ] Pixel loads on all pages
- [ ] PageView events firing
- [ ] Lead events firing on email submission
- [ ] Purchase events firing on prize win
- [ ] Custom events (WheelSpin, ExternalClick) firing
- [ ] Event parameters are correct
- [ ] Server-side events sending (if implemented)

---

## Step 11: Campaign Optimization

### 11.1 Campaign Setup

When creating Meta ads:

1. **Campaign Objective**: Choose "Leads" or "Conversions"
2. **Conversion Event**: Select "Lead" as primary conversion
3. **Audience**: Use pixel data for lookalike audiences
4. **Optimization**: Optimize for Lead events

### 11.2 Audience Creation

Create these audiences in Ads Manager:

1. **Website Visitors**: All pixel fires
2. **Engaged Users**: Users who triggered WheelSpin
3. **Leads**: Users who completed Lead event
4. **High-Value Leads**: Users with high prize amounts

### 11.3 Lookalike Audiences

Create lookalike audiences based on:

- Email submissions (Lead events)
- High-value conversions
- Engaged users

---

## Step 12: Advanced Features

### 12.1 Enhanced Matching

Implement enhanced matching for better attribution:

```typescript
// In MetaPixel component
const userData = {
  email: userEmail, // If available
  phone: userPhone, // If available
  firstName: userFirstName, // If available
  lastName: userLastName, // If available
};

window.fbq("init", pixelId, userData);
```

### 12.2 Dynamic Product Ads (Future)

If you expand to multiple games/products:

```typescript
window.fbq("track", "ViewContent", {
  content_ids: ["spin_wheel_game"],
  content_type: "product",
  content_name: "Spin Wheel Game",
  content_category: "Gaming",
});
```

---

## Step 13: Privacy and Compliance

### 13.1 iOS 14.5+ Considerations

Handle iOS tracking limitations:

- Implement Conversions API for server-side tracking
- Use first-party data collection
- Implement proper consent management

### 13.2 GDPR Compliance

Add consent management:

```typescript
// In your consent banner
export const updateMetaConsent = (granted: boolean) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("consent", granted ? "grant" : "revoke");
  }
};
```

---

## Step 14: Monitoring and Optimization

### 14.1 Key Metrics to Monitor

- **Event Match Rate**: Aim for >80%
- **Pixel Health Score**: Keep above 8/10
- **Conversion Rate**: Track Lead/PageView ratio
- **Cost Per Lead**: Monitor campaign efficiency
- **Attribution Quality**: Server-side vs client-side events

### 14.2 Regular Maintenance

Monthly tasks:

- Review Event Match Rate
- Check for pixel errors
- Update audience definitions
- Optimize based on performance data

---

## Troubleshooting

### Common Issues:

1. **Pixel not firing**: Check browser console and Meta Pixel Helper
2. **Events not recording**: Verify event names and parameters
3. **Low match rates**: Implement enhanced matching and Conversions API
4. **Attribution issues**: Check attribution windows and data sources

### Debug Tools:

- Meta Pixel Helper (Browser Extension)
- Meta Events Manager Test Events
- Browser Developer Tools
- Meta Ads Manager Diagnostics

---

## Summary

This comprehensive setup provides:

✅ **Website Events**: Complete pixel implementation with standard and custom events
✅ **App Events**: Framework for future mobile app integration  
✅ **Offline Events**: Server-side tracking for improved data quality
✅ **Dataset Quality API**: Enhanced measurement and attribution
✅ **Privacy Compliance**: GDPR and iOS 14.5+ considerations

Your Meta conversion tracking is now ready to provide detailed insights into your ad performance and help optimize your campaigns for better ROI.

## Next Steps

1. Add your Meta Pixel ID to environment variables
2. Test the implementation thoroughly
3. Set up conversions in Ads Manager
4. Create your first campaign optimized for Lead events
5. Monitor performance and iterate based on data
