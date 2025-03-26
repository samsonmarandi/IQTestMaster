import { QuestionOption } from "@/components/QuestionOption";
import { Question } from "@shared/schema";

interface PatternQuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
}

// Pattern visualization components
const CirclePattern = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'center' }) => {
  const positionClass = {
    topLeft: "top-1 left-1",
    topRight: "top-1 right-1",
    bottomRight: "bottom-1 right-1",
    bottomLeft: "bottom-1 left-1",
    center: "inset-0 m-auto",
  }[position];

  return (
    <div className="w-16 h-16 border-2 border-gray-700 relative">
      <div className={`w-8 h-8 rounded-full bg-gray-700 absolute ${positionClass}`}></div>
    </div>
  );
};

// Sample pattern sequence
const PatternSequence = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <CirclePattern position="topLeft" />
      </div>
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <CirclePattern position="topRight" />
      </div>
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <CirclePattern position="bottomRight" />
      </div>
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <CirclePattern position="bottomLeft" />
      </div>
      <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gray-700 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">?</span>
        </div>
      </div>
    </div>
  );
};

export function PatternQuestion({ question, selectedAnswer, onSelectAnswer }: PatternQuestionProps) {
  // This maps option IDs to visual patterns
  const patternMap: Record<string, React.ReactNode> = {
    'a': <CirclePattern position="topLeft" />,
    'b': <CirclePattern position="center" />,
    'c': <CirclePattern position="topLeft" />,
    'd': <CirclePattern position="bottomRight" />
  };

  return (
    <div className="question-block">
      <h2 className="font-semibold text-xl mb-4 text-gray-800">Pattern Recognition</h2>
      <p className="mb-4 text-gray-700">{question.text}</p>
      
      <PatternSequence />
      
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => (
          <div key={option.id} className="option">
            <input
              type="radio"
              id={`pattern-${option.id}`}
              name="pattern-answer"
              className="hidden peer"
              checked={selectedAnswer === option.id}
              onChange={() => onSelectAnswer(option.id)}
            />
            <label
              htmlFor={`pattern-${option.id}`}
              className="block aspect-square bg-gray-50 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              {patternMap[option.id]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
