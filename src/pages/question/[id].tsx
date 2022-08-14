import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.getById",
    { id },
  ]);
  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.voteOnQuestion"
  );

  if (!isLoading && !data) {
    return <div>Question not found.</div>;
  }

  return (
    <div className="p-8 flex flex-col">
      {data?.isOwner && (
        <div className="bg-red-400 rounded-md p-4">You are the owner!</div>
      )}
      <div className="text-2xl font-bold">{data?.pollQuestion?.question}</div>
      <div className="flex flex-col gap-4">
        {(data?.pollQuestion?.options as string[])?.map((option, index) => {
          if (data?.isOwner || data?.vote) {
            return <div>{(option as any).text}</div>;
          }

          return (
            <button
              key={index}
              onClick={() =>
                mutate({
                  questionId: data.pollQuestion!.id,
                  option: index,
                })
              }
            >
              {(option as any).text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id) {
    return <div>No ID</div>;
  }

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
