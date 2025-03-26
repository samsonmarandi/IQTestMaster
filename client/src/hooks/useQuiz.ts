import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QUIZ_CONSTANTS } from "@/lib/constants";
import { Question, UserInfo, InsertQuizResult } from "@shared/schema";
import { calculateIQ } from "@/lib/utils/iqCalculation";
import { selectQuestions } from "@/lib/utils/questionUtils";
import { apiRequest } from "@/lib/queryClient";

export function useQuiz() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timer, setTimer] = useState(QUIZ_CONSTANTS.QUESTION_TIMER_SECONDS);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [resultId, setResultId] = useState<number | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Fetch all questions
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['/api/questions'],
    enabled: isQuizStarted, // Only fetch when quiz starts
  });

  // Submit quiz result mutation
  const { mutate: submitResult, isPending: isSubmittingResult } = useMutation({
    mutationFn: async (result: InsertQuizResult) => {
      const response = await apiRequest('POST', '/api/results', result);
      return response.json();
    },
    onSuccess: (data) => {
      setResultId(data.id);
      toast({
        title: "Quiz completed!",
        description: "Your results have been saved.",
      });
      
      // Navigate to results page with the result ID
      navigate(`/results?id=${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error saving results",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit individual question attempt
  const { mutate: submitAttempt } = useMutation({
    mutationFn: async (data: { 
      resultId: number, 
      questionId: number, 
      userAnswer: string,
      isCorrect: boolean,
      timeSpent: number
    }) => {
      await apiRequest('POST', '/api/attempts', {
        resultId: data.resultId,
        questionId: data.questionId,
        userAnswer: data.userAnswer,
        isCorrect: data.isCorrect,
        timeSpent: data.timeSpent
      });
    },
    onError: (error) => {
      console.error("Error saving attempt:", error);
    },
  });

  // Initialize quiz with selected questions
  useEffect(() => {
    if (questions && isQuizStarted && !quizQuestions.length) {
      const selected = selectQuestions(
        questions, 
        QUIZ_CONSTANTS.TOTAL_QUESTIONS_PER_TYPE
      );
      setQuizQuestions(selected);
      setStartTime(new Date());
    }
  }, [questions, isQuizStarted, quizQuestions.length]);

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && quizQuestions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Time's up, move to next question
            handleNextQuestion();
            return QUIZ_CONSTANTS.QUESTION_TIMER_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isQuizStarted, quizQuestions]);

  // Handle starting the quiz
  const startQuiz = useCallback((info: UserInfo) => {
    setUserInfo(info);
    setIsQuizStarted(true);
    setTimer(QUIZ_CONSTANTS.QUESTION_TIMER_SECONDS);
  }, []);

  // Handle answering a question
  const answerQuestion = useCallback((questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  // Move to the next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimer(QUIZ_CONSTANTS.QUESTION_TIMER_SECONDS);
    } else {
      // Quiz is completed
      completeQuiz();
    }
  }, [currentQuestionIndex, quizQuestions]);

  // Complete the quiz and submit results
  const completeQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsQuizCompleted(true);

    if (!userInfo || !startTime) return;

    // Calculate scores
    const totalQuestions = quizQuestions.length;
    let correctAnswers = 0;
    
    const typeScores = {
      logical: { correct: 0, total: 0 },
      mathematical: { correct: 0, total: 0 },
      pattern: { correct: 0, total: 0 }
    };

    quizQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      // Track by question type
      if (typeScores[question.type as keyof typeof typeScores]) {
        typeScores[question.type as keyof typeof typeScores].total += 1;
        if (isCorrect) {
          typeScores[question.type as keyof typeof typeScores].correct += 1;
        }
      }
    });

    // Calculate time spent
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Calculate IQ score
    const ageAdjustment = userInfo.age < 18 ? 5 : 0; // Slight adjustment for younger test takers
    const iqScore = calculateIQ(correctAnswers, totalQuestions, ageAdjustment);

    // Submit the quiz result
    const result: InsertQuizResult = {
      name: userInfo.name,
      age: userInfo.age,
      educationLevel: userInfo.educationLevel,
      score: correctAnswers,
      iqScore,
      logicalScore: typeScores.logical.correct,
      mathematicalScore: typeScores.mathematical.correct,
      patternScore: typeScores.pattern.correct,
      totalQuestions,
      timeSpent,
      createdAt: new Date().toISOString()
    };

    submitResult(result);
  }, [userInfo, startTime, quizQuestions, answers, submitResult]);

  // Restart the quiz
  const restartQuiz = useCallback(() => {
    setUserInfo(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimer(QUIZ_CONSTANTS.QUESTION_TIMER_SECONDS);
    setStartTime(null);
    setQuizQuestions([]);
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    navigate('/');
  }, [navigate]);

  return {
    userInfo,
    currentQuestionIndex,
    answers,
    timer,
    quizQuestions,
    resultId,
    isQuizStarted,
    isQuizCompleted,
    isLoadingQuestions,
    isSubmittingResult,
    startQuiz,
    answerQuestion,
    handleNextQuestion,
    restartQuiz,
    getCurrentQuestion: () => quizQuestions[currentQuestionIndex],
    getTotalQuestions: () => quizQuestions.length,
    getProgress: () => (currentQuestionIndex / quizQuestions.length) * 100,
  };
}
