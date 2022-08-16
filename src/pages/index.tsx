import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { trpc } from "../utils/trpc";

import ShareIcon from "../../public/share.svg";

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["questions.getAllMyQuestions"]);

  const options = { year: "numeric", month: "short", day: "numeric" };

  data?.sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  if (!data || isLoading) return <Spinner />;

  return (
    <div className="md:my-6">
      <div className="header flex w-full justify-between items-end mb-6 md:mb-12">
        <div className="text-3xl xl:text-5xl font-bold">Your Polls</div>
        <Link href="/create">
          <a className="bg-[#888fd2]/60 hover:bg-[#888fd2]/30 transition rounded text-white font-bold p-2">
            Add Poll
          </a>
        </Link>
      </div>
      {data.length === 0 && (
        <div className="text-gray-600">No polls found.</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-4">
        {data.map((question) => {
          let expired = false;
          let timeRemaining = question.endsAt
            ? (question.endsAt.getTime() - new Date().getTime()) / (60000 * 60)
            : 0;

          if (question.endsAt && timeRemaining < 0) {
            expired = true;
          }

          return (
            <Link href={`/question/${question.id}`} key={question.id}>
              <div
                key={question.id}
                className="flex flex-col my-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded p-2 pl-4 pb-4 transition"
                style={{
                  opacity: expired ? "0.4" : "1",
                  pointerEvents: expired ? "none" : "auto",
                }}
              >
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400">
                    {question.createdAt.toLocaleDateString(
                      "en-US",
                      options as any
                    )}
                  </span>
                  <button
                    className="flex justify-center items-center hover:bg-gray-300 transition rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(
                        `Share this link: ${
                          process.env.PUBLIC_URL
                            ? "https://" + process.env.PUBLIC_URL
                            : "http://localhost:3000"
                        }/question/${question.id}`
                      );
                    }}
                  >
                    <Image
                      src={ShareIcon}
                      alt="share"
                      width="24px"
                      height="24px"
                    />
                  </button>
                </div>
                <div className="text-xl font-bold my-4">
                  {question.question}
                </div>
                <div className="flex-1 flex items-end">
                  <div
                    className={`text-[10px] uppercase font-bold ${
                      timeRemaining < 3 && timeRemaining > 0
                        ? "text-red-400"
                        : "text-gray-500"
                    }`}
                  >
                    {!question.endsAt && <>Ongoing</>}
                    {question.endsAt && expired && <>Expired</>}
                    {question.endsAt && !expired && (
                      <>Ends in {Math.round(timeRemaining)}h</>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
