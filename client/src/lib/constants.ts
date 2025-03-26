export const QUIZ_CONSTANTS = {
  QUESTION_TIMER_SECONDS: 60,
  TOTAL_QUESTIONS_PER_TYPE: 10, // 10 questions per type (logical, mathematical, pattern)
  QUESTION_TYPES: ["logical", "mathematical", "pattern"] as const,
  MIN_AGE: 8,
  MAX_AGE: 99,
};

export const EDUCATION_LEVELS = [
  { value: "elementary", label: "Elementary School" },
  { value: "highschool", label: "High School" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD or Doctorate" },
];

export const IQ_LEVELS = [
  { min: 0, max: 69, label: "Extremely Low" },
  { min: 70, max: 84, label: "Borderline" },
  { min: 85, max: 114, label: "Average" },
  { min: 115, max: 129, label: "Above Average" },
  { min: 130, max: 144, label: "Gifted" },
  { min: 145, max: 300, label: "Genius" },
];
