import React from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      client.invalidateQueries('questions.getAllMyQuestions');
    }
  })

  return (
    <input 
      ref={inputRef} 
      disabled={isLoading} 
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          mutate({question: event.currentTarget.value});
          if (!inputRef.current) return;
          inputRef.current.value = "";
        }
      }} 
    />
  )
}

export default QuestionCreator;