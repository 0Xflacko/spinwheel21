import crypto from "crypto";

interface ConversionEvent {
  event_name: string;
  event_time: number;
  user_data: {
    em?: string; // email (hashed)
    ph?: string; // phone (hashed)
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    num_items?: number;
  };
  event_source_url?: string;
  action_source: "website";
  event_id?: string; // For deduplication
}

/**
 * Send conversion event to Meta Conversions API
 */
export async function sendMetaConversion(
  event: ConversionEvent
): Promise<boolean> {
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

/**
 * Hash user data for privacy compliance
 */
export function hashUserData(data: string): string {
  return crypto
    .createHash("sha256")
    .update(data.toLowerCase().trim())
    .digest("hex");
}

/**
 * Generate unique event ID for deduplication
 */
export function generateEventId(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Extract Facebook click ID from URL or cookies
 */
export function getFacebookClickId(request: Request): string | undefined {
  // Try to get from URL parameters first
  const url = new URL(request.url);
  const fbclid = url.searchParams.get("fbclid");

  if (fbclid) {
    return `fb.1.${Date.now()}.${fbclid}`;
  }

  // Try to get from cookies
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    return cookies._fbc;
  }

  return undefined;
}

/**
 * Extract Facebook browser ID from cookies
 */
export function getFacebookBrowserId(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    return cookies._fbp;
  }

  return undefined;
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string | undefined {
  // Check various headers for IP address
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return undefined;
}

/**
 * Create a Lead conversion event
 */
export function createLeadEvent(
  email: string,
  prizeAmount: number,
  request: Request,
  eventId?: string
): ConversionEvent {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || undefined;
  const fbc = getFacebookClickId(request);
  const fbp = getFacebookBrowserId(request);
  const referer = request.headers.get("referer") || undefined;

  return {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    user_data: {
      em: hashUserData(email),
      client_ip_address: clientIP,
      client_user_agent: userAgent,
      fbc,
      fbp,
    },
    custom_data: {
      value: prizeAmount,
      currency: "USD",
      content_name: "email_submission",
      content_category: "conversion",
    },
    event_source_url: referer,
    action_source: "website",
    event_id: eventId || generateEventId(),
  };
}

/**
 * Create a Purchase conversion event
 */
export function createPurchaseEvent(
  email: string,
  prizeAmount: number,
  request: Request,
  eventId?: string
): ConversionEvent {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || undefined;
  const fbc = getFacebookClickId(request);
  const fbp = getFacebookBrowserId(request);
  const referer = request.headers.get("referer") || undefined;

  return {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    user_data: {
      em: hashUserData(email),
      client_ip_address: clientIP,
      client_user_agent: userAgent,
      fbc,
      fbp,
    },
    custom_data: {
      value: prizeAmount,
      currency: "USD",
      content_ids: ["raffle_entry"],
      content_name: "Raffle Entry",
      content_category: "Gaming",
      num_items: 1,
    },
    event_source_url: referer,
    action_source: "website",
    event_id: eventId || generateEventId(),
  };
}

/**
 * Send both Lead and Purchase events for email submission
 */
export async function trackEmailSubmissionToMeta(
  email: string,
  prizeAmount: number,
  request: Request
): Promise<{ leadSent: boolean; purchaseSent: boolean }> {
  const eventId = generateEventId();

  // Send Lead event
  const leadEvent = createLeadEvent(email, prizeAmount, request, eventId);
  const leadSent = await sendMetaConversion(leadEvent);

  // Send Purchase event (for enhanced tracking)
  const purchaseEvent = createPurchaseEvent(
    email,
    prizeAmount,
    request,
    `${eventId}_purchase`
  );
  const purchaseSent = await sendMetaConversion(purchaseEvent);

  return { leadSent, purchaseSent };
}
