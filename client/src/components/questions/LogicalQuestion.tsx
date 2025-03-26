import { QuestionOption } from "@/components/QuestionOption";
import { Question } from "@shared/schema";

interface LogicalQuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answer: string) => void;
}

export function LogicalQuestion({ question, selectedAnswer, onSelectAnswer }: LogicalQuestionProps) {
  return (
    <div className="question-block">
      <h2 className="font-semibold text-xl mb-4 text-gray-800">Logical Reasoning</h2>
      <p className="mb-6 text-gray-700">{question.text}</p>
      
      <div className="space-y-3">
        {question.options.map((option) => (
          <QuestionOption
            key={option.id}
            id={`logical-${option.id}`}
            value={option.id}
            text={option.text}
            name="logical-answer"
            selected={selectedAnswer === option.id}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
}
