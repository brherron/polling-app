import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["questions.getAllMyQuestions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="w-100 h-100 flex justify-center items-center font-bold">
      404 Not Found
    </div>
  );
};

export default Home;
