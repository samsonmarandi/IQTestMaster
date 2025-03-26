import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  onTimeUp?: () => void;
}

export function Timer({ seconds, onTimeUp }: TimerProps) {
  const [isLow, setIsLow] = useState(false);
  
  useEffect(() => {
    setIsLow(seconds <= 10);
  }, [seconds]);
  
  return (
    <div className={`flex items-center bg-gray-100 px-3 py-1 rounded-full ${isLow ? 'animate-pulse' : ''}`}>
      <Clock className={`h-5 w-5 ${isLow ? 'text-red-500' : 'text-gray-600'} mr-1`} />
      <span className={`font-medium ${isLow ? 'text-red-500' : ''}`}>{seconds}</span>
    </div>
  );
}
