import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const { mutate } = trpc.useMutation("questions.create")

  return (
    <input onSubmit={(event) => console.log(event)} />
  )
}

const Home: NextPage = (props: any) => {
  const { data, isLoading } = trpc.useQuery(["questions.getAll"]);

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Questions</div>
        {data[0]?.question}
      </div>
      <QuestionCreator />
    </>
  )
};

export default Home;