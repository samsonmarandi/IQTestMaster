import { forwardRef } from "react";

interface QuestionOptionProps {
  id: string;
  value: string;
  text: string;
  name: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export const QuestionOption = forwardRef<HTMLInputElement, QuestionOptionProps>(
  ({ id, value, text, name, selected, onSelect }, ref) => {
    return (
      <div className="option">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          className="hidden peer"
          checked={selected}
          onChange={() => onSelect(value)}
          ref={ref}
        />
        <label
          htmlFor={id}
          className="block w-full p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 hover:bg-gray-100 transition-colors"
        >
          <div className="font-medium">{text}</div>
        </label>
      </div>
    );
  }
);

QuestionOption.displayName = "QuestionOption";
