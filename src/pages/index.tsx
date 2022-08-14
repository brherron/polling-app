import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["questions.getAllMyQuestions"]);

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <div className="p-6 flex flex-col w-screen items-stretch">
      <div className="header flex w-full justify-between">
        <div className="text-2xl font-bold">Your Questions</div>
        <Link href="/create">
          <a className="bg-gray-300 rounded text-gray-800 px-4 py-2">Create New Question</a>
        </Link>
      </div>
      <div className="flex flex-col">
        {data.map(question => {
          return (
            <Link href={`/question/${question.id}`} key={question.id}>
              <div key={question.id} className="flex flex-col my-2">
                <div>{question.question}</div>
                <span>Created on {question.createdAt.toDateString()}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
};

export default Home;