import { IQ_LEVELS } from "../constants";

/**
 * Calculate IQ score based on test performance
 * 
 * This is a simplified IQ calculation for demonstration purposes
 * Real IQ tests use complex standardized scoring algorithms
 */
export function calculateIQ(correctAnswers: number, totalQuestions: number, ageAdjustment: number = 0): number {
  // Base IQ score calculation (100 is average)
  const baseIQ = 100;
  
  // Performance ratio (between 0 and 1)
  const performanceRatio = correctAnswers / totalQuestions;
  
  // Calculate deviation from average (bell curve distribution)
  // We'll use a simple approximation where 100 is average and each 15 points is 1 standard deviation
  const deviation = (performanceRatio - 0.5) * 60;
  
  // Add age adjustment - slightly higher scores for younger test takers
  // This is a simplified version of age normalization
  const ageAdjustedIQ = baseIQ + deviation + ageAdjustment;
  
  // Ensure the IQ score is within a reasonable range
  return Math.max(70, Math.min(Math.round(ageAdjustedIQ), 160));
}

/**
 * Get IQ level label based on score
 */
export function getIQLevel(iqScore: number): string {
  const level = IQ_LEVELS.find(
    level => iqScore >= level.min && iqScore <= level.max
  );
  
  return level?.label || "Average";
}

/**
 * Calculate percentile ranking based on IQ score
 * Returns an approximation of what percentage of people score lower than this score
 */
export function calculatePercentileRanking(iqScore: number): number {
  // Using standard normal distribution properties
  // Mean IQ = 100, Standard Deviation = 15
  
  // Simplified calculation for demo purposes
  // In reality, this would use a standard normal cumulative distribution function
  
  if (iqScore <= 70) return 2;
  if (iqScore <= 85) return 16;
  if (iqScore <= 100) return 50;
  if (iqScore <= 115) return 84;
  if (iqScore <= 130) return 98;
  
  return 99;
}
