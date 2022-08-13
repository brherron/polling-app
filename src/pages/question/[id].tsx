import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{id: string}> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery(["questions.getById", { id }]);

  if (!isLoading && !data) {
    return <div>Question not found.</div>
  }

  return (
    <div className="p-8 flex flex-col">
      {data?.isOwner && <div className="bg-red-300 rounded-md p-4">You are the owner!</div>}
      <div className="text-2xl font-bold">
        {data?.pollQuestion?.question}
      </div>
      <div>
        {(data?.pollQuestion?.options as string[])?.map(option => (
          <div>{option}</div>
        ))}
      </div>
    </div>
  )
}

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id) {
    return <div>No ID</div>
  }

  return <QuestionsPageContent id={id} />;
}

export default QuestionPage;