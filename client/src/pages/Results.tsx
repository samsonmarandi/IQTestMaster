import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ResultsScreen } from "@/components/ResultsScreen";
import { QuizResult } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [resultId, setResultId] = useState<number | null>(null);
  
  // Parse result ID from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    if (id) {
      const parsedId = parseInt(id);
      if (!isNaN(parsedId)) {
        setResultId(parsedId);
      } else {
        toast({
          title: "Invalid Result ID",
          description: "We couldn't find your test results.",
          variant: "destructive",
        });
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate, toast]);
  
  // Fetch quiz result data
  const { data: result, isLoading, error } = useQuery<QuizResult>({
    queryKey: ['/api/results', resultId],
    enabled: resultId !== null,
  });
  
  const handleTakeAgain = () => {
    // Clear any stored quiz data
    sessionStorage.removeItem("userInfo");
    
    // Navigate back to home
    navigate("/");
  };
  
  if (isLoading || !result) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-pulse">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          
          <Skeleton className="h-48 w-48 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-6 w-72 mx-auto mb-8" />
          
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          
          <Skeleton className="h-64 rounded-lg mb-8" />
          
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    toast({
      title: "Error loading results",
      description: "We couldn't load your test results. Please try again.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <ResultsScreen result={result} onTakeAgain={handleTakeAgain} />
    </div>
  );
}
