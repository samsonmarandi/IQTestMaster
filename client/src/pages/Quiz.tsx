import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { QuizInterface } from "@/components/QuizInterface";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz } from "@/hooks/useQuiz";
import { UserInfo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Quiz() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const {
    userInfo,
    currentQuestionIndex,
    answers,
    timer,
    quizQuestions,
    isQuizStarted,
    isLoadingQuestions,
    startQuiz,
    answerQuestion,
    handleNextQuestion,
    restartQuiz,
    getCurrentQuestion,
    getTotalQuestions,
  } = useQuiz();

  // On component mount, check for user info in session storage
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo) as UserInfo;
        startQuiz(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
        toast({
          title: "Error",
          description: "There was an error starting the quiz. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      }
    } else {
      // No user info, redirect to home
      navigate("/");
    }
    
    setIsInitializing(false);
  }, []);

  // Current question
  const currentQuestion = getCurrentQuestion();
  const totalQuestions = getTotalQuestions();
  
  // Get selected answer for current question
  const selectedAnswer = currentQuestion 
    ? answers[currentQuestion.id] 
    : undefined;
  
  // Handle answering the current question
  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, answer);
    }
  };

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-20 w-full mb-6 rounded-xl" />
        <Skeleton className="h-96 w-full mb-6 rounded-xl" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <QuizInterface
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        timer={timer}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        onNext={handleNextQuestion}
        onQuit={restartQuiz}
        isLoading={isLoadingQuestions || !isQuizStarted}
      />
    </div>
  );
}
