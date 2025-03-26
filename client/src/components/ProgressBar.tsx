interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = Math.floor((current / total) * 100);
  
  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-secondary h-full rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
