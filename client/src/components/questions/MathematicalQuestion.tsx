import { QuestionOption } from "@/components/QuestionOption";
import { Question } from "@shared/schema";

interface MathematicalQuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
}

export function MathematicalQuestion({ question, selectedAnswer, onSelectAnswer }: MathematicalQuestionProps) {
  return (
    <div className="question-block">
      <h2 className="font-semibold text-xl mb-4 text-gray-800">Mathematical Ability</h2>
      <p className="mb-6 text-gray-700">{question.text}</p>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <QuestionOption
            key={option.id}
            id={`math-${option.id}`}
            value={option.id}
            text={option.text}
            name="math-answer"
            selected={selectedAnswer === option.id}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
}
