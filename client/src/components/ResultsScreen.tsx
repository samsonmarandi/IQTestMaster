import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizResult } from "@shared/schema";
import { getIQLevel, calculatePercentileRanking } from "@/lib/utils/iqCalculation";
import { Share, RotateCcw } from "lucide-react";
import { IQ_LEVELS } from "@/lib/constants";

interface ResultsScreenProps {
  result: QuizResult;
  onTakeAgain: () => void;
}

export function ResultsScreen({ result, onTakeAgain }: ResultsScreenProps) {
  const iqLevel = getIQLevel(result.iqScore);
  const percentile = calculatePercentileRanking(result.iqScore);
  
  // Calculate performance percentages for each category
  const logicalPercentage = (result.logicalScore / (result.totalQuestions / 3)) * 100;
  const mathematicalPercentage = (result.mathematicalScore / (result.totalQuestions / 3)) * 100;
  const patternPercentage = (result.patternScore / (result.totalQuestions / 3)) * 100;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My IQ Test Results',
        text: `I just took an IQ test and scored ${result.iqScore}! Try it yourself!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(
        `I just took an IQ test and scored ${result.iqScore}! Try it yourself at ${window.location.origin}`
      ).then(() => {
        alert('Result link copied to clipboard!');
      }).catch(console.error);
    }
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Your IQ Test Results</h1>
          <p className="text-gray-600">Based on your performance, we've calculated your IQ score</p>
        </div>
        
        <div className="mb-10">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-8 border-primary">
              <span className="text-5xl font-bold text-gray-800">{result.iqScore}</span>
            </div>
            <div className="absolute -bottom-2 left-0 right-0 text-center">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">{iqLevel}</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Great job!</h2>
          <p className="text-gray-600">Your score is higher than {percentile}% of test takers</p>
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold text-xl mb-4 text-gray-800">Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-1">Logical Reasoning</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className="font-semibold">{result.logicalScore}/{result.totalQuestions / 3}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${logicalPercentage}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-1">Mathematical Ability</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className="font-semibold">{result.mathematicalScore}/{result.totalQuestions / 3}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${mathematicalPercentage}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-1">Pattern Recognition</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Performance</span>
                <span className="font-semibold">{result.patternScore}/{result.totalQuestions / 3}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${patternPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold text-xl mb-4 text-gray-800">What Your Score Means</h3>
          <div className="bg-blue-50 border-l-4 border-primary p-4 text-left rounded">
            <p className="text-gray-700 mb-2">IQ scores typically follow this distribution:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {IQ_LEVELS.map((level) => (
                <li key={level.label}>
                  {level.min === 0 ? 'Below 70' : level.min}-{level.max}: {level.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
            onClick={handleShare}
          >
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          
          <Button 
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={onTakeAgain}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Test Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
