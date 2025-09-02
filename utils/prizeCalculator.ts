// Prize distribution system for the spin wheel
// Creates a fair distribution of prizes based on wheel segments

export interface PrizeSegment {
  minDegree: number;
  maxDegree: number;
  amount: number;
  probability: number; // For reference, not used in calculation
}

// Define 6 segments (60 degrees each) matching the actual wheel prizes
// Direct mapping: pointer at top (12 o'clock), 0 degrees = top, going counter-clockwise
export const PRIZE_SEGMENTS: PrizeSegment[] = [
  { minDegree: 330, maxDegree: 360, amount: 100, probability: 0.167 }, // Top segment (partial)
  { minDegree: 0, maxDegree: 30, amount: 100, probability: 0.167 }, // Top segment (partial)
  { minDegree: 30, maxDegree: 90, amount: 500, probability: 0.167 }, // Top-left (green)
  { minDegree: 90, maxDegree: 150, amount: 200, probability: 0.167 }, // Left (purple)
  { minDegree: 150, maxDegree: 210, amount: 20, probability: 0.167 }, // Bottom-left (green)
  { minDegree: 210, maxDegree: 270, amount: 50, probability: 0.167 }, // Bottom (purple)
  { minDegree: 270, maxDegree: 330, amount: 300, probability: 0.167 }, // Bottom-right (green)
];

/**
 * Calculates the prize amount based on the final rotation degree
 * @param rotationDegrees - The final rotation degree (0-360)
 * @returns The prize amount in USDC
 */
export function calculatePrize(rotationDegrees: number): number {
  // Normalize the rotation to 0-360 range
  let normalizedDegree = ((rotationDegrees % 360) + 360) % 360;

  // Try direct mapping without inversion first
  // normalizedDegree = (360 - normalizedDegree) % 360;

  // Find the segment that contains this degree
  // Handle special case for segments that cross the 0-degree boundary
  const segment = PRIZE_SEGMENTS.find((seg) => {
    if (seg.minDegree > seg.maxDegree) {
      // Segment crosses 0 degrees (like 330-360 and 0-30 for $100)
      return (
        normalizedDegree >= seg.minDegree || normalizedDegree < seg.maxDegree
      );
    } else {
      // Normal segment
      return (
        normalizedDegree >= seg.minDegree && normalizedDegree < seg.maxDegree
      );
    }
  });

  // Add debug logging to help troubleshoot
  console.log(
    `Rotation: ${rotationDegrees}, Normalized: ${normalizedDegree}, Prize: ${
      segment?.amount || 100
    }`
  );

  // Return the prize amount, default to 100 if no segment found (shouldn't happen)
  return segment ? segment.amount : 100;
}

/**
 * Gets all possible prize amounts for display purposes
 */
export function getAllPrizeAmounts(): number[] {
  return PRIZE_SEGMENTS.map((segment) => segment.amount).sort((a, b) => b - a);
}
