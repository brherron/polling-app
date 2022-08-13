import type { NextPage } from "next";
import React from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      client.invalidateQueries('questions.getAll');
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

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["questions.getAll"]);

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <div className="p-6 flex flex-col">
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Questions</div>
        {data.map(question => {
          return (
            <div key={question.id} className="my-2">
              {question.question}
            </div>
          );
        })}
      </div>
      <QuestionCreator />
    </div>
  )
};

export default Home;