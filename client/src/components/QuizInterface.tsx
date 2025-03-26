import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/Timer";
import { ProgressBar } from "@/components/ProgressBar";
import { LogicalQuestion } from "@/components/questions/LogicalQuestion";
import { MathematicalQuestion } from "@/components/questions/MathematicalQuestion";
import { PatternQuestion } from "@/components/questions/PatternQuestion";
import { Question } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizInterfaceProps {
  currentQuestion: Question | undefined;
  currentQuestionIndex: number;
  totalQuestions: number;
  timer: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onQuit: () => void;
  isLoading: boolean;
}

export function QuizInterface({ 
  currentQuestion, 
  currentQuestionIndex, 
  totalQuestions, 
  timer, 
  selectedAnswer, 
  onAnswer, 
  onNext, 
  onQuit,
  isLoading
}: QuizInterfaceProps) {
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);

  // Apply transition effect when moving to next question
  useEffect(() => {
    setIsQuestionTransitioning(true);
    const timeout = setTimeout(() => {
      setIsQuestionTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex]);

  const renderQuestionComponent = () => {
    if (isLoading || !currentQuestion) {
      return <QuestionSkeleton />;
    }

    switch (currentQuestion.type) {
      case 'logical':
        return (
          <LogicalQuestion 
            question={currentQuestion} 
            selectedAnswer={selectedAnswer} 
            onSelectAnswer={onAnswer} 
          />
        );
      case 'mathematical':
        return (
          <MathematicalQuestion 
            question={currentQuestion} 
            selectedAnswer={selectedAnswer} 
            onSelectAnswer={onAnswer} 
          />
        );
      case 'pattern':
        return (
          <PatternQuestion 
            question={currentQuestion} 
            selectedAnswer={selectedAnswer} 
            onSelectAnswer={onAnswer} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header with progress and timer */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-semibold text-gray-800 mr-2">Question:</span>
          <span className="text-primary font-semibold">{currentQuestionIndex + 1}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-600">{totalQuestions}</span>
        </div>
        
        <div className="w-1/2">
          <ProgressBar 
            current={currentQuestionIndex + 1} 
            total={totalQuestions} 
          />
        </div>
        
        <Timer seconds={timer} />
      </div>
      
      {/* Question Container */}
      <div 
        className={`bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 ease-in-out ${
          isQuestionTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {renderQuestionComponent()}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="ghost" 
          className="px-4 py-2 text-gray-600 rounded-lg font-medium hover:bg-gray-100 focus:outline-none transition-colors"
          onClick={() => setShowQuitDialog(true)}
        >
          Quit Test
        </Button>
        
        <Button 
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={onNext}
          disabled={isLoading}
        >
          Next Question
        </Button>
      </div>

      {/* Quit Confirmation Dialog */}
      <AlertDialog open={showQuitDialog} onOpenChange={setShowQuitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to quit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost and you will need to start the test again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onQuit}>Yes, quit test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Loading skeleton for questions
function QuestionSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-6 w-full mb-6" />
      
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  );
}
