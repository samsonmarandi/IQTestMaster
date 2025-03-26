import { Question } from "@shared/schema";

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Select a specified number of questions from each type
 */
export function selectQuestions(
  questions: Question[],
  countPerType: number
): Question[] {
  const typesMap: Record<string, Question[]> = {};
  
  // Group questions by type
  questions.forEach(question => {
    if (!typesMap[question.type]) {
      typesMap[question.type] = [];
    }
    typesMap[question.type].push(question);
  });
  
  const selectedQuestions: Question[] = [];
  
  // Select and shuffle questions for each type
  Object.values(typesMap).forEach(typeQuestions => {
    const shuffled = shuffleArray(typeQuestions);
    // Take up to countPerType or all available if there are fewer
    selectedQuestions.push(...shuffled.slice(0, countPerType));
  });
  
  // Shuffle the final selection so questions aren't grouped by type
  return shuffleArray(selectedQuestions);
}

/**
 * Calculate score breakdown by question type
 */
export function calculateTypeScores(
  questions: Question[],
  attempts: Record<number, string>
): Record<string, { correct: number, total: number }> {
  const scores: Record<string, { correct: number, total: number }> = {
    logical: { correct: 0, total: 0 },
    mathematical: { correct: 0, total: 0 },
    pattern: { correct: 0, total: 0 }
  };
  
  questions.forEach(question => {
    const questionType = question.type;
    if (scores[questionType]) {
      scores[questionType].total += 1;
      
      // Check if answer is correct
      const userAnswer = attempts[question.id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        scores[questionType].correct += 1;
      }
    }
  });
  
  return scores;
}
