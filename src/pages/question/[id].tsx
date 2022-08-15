import { useRouter } from "next/router";
import Spinner from "../../components/Spinner";
import { questionRouter } from "../../server/router/questions";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.getById",
    { id },
  ]);
  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.voteOnQuestion",
    { onSuccess: () => window.location.reload() }
  );

  if (isLoading && data) return <Spinner />;

  if (data && !isLoading) {
    let totalVotes = 0;
    data.votes?.map((votes) => {
      totalVotes += votes?._count;
    });

    const expiration = data.pollQuestion?.endsAt
      ? data.pollQuestion.endsAt.getTime() - new Date().getTime()
      : 0;

    return (
      <div className="p-8 flex flex-col slide-in max-h-full min-h-full">
        <div className="flex justify-between items-start">
          <div className="text-2xl font-bold">
            {data?.pollQuestion?.question}
          </div>
          {data?.isOwner && (
            <div className="bg-red-200 rounded-md px-3 py-1 ml-4 text-white font-bold uppercase">
              Owner
            </div>
          )}
        </div>
        {data.pollQuestion?.endsAt && (
          <div className="text-gray-400">
            Ending in {Math.round((expiration / 3600000) * 2) / 2}h
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4 mt-12">
          <div className="flex justify-between">
            <div className="text-md text-gray-500">
              {data?.isOwner || data?.vote ? "Poll Results" : "Select One"}
            </div>
            {(data?.vote || data?.isOwner) && (
              <div className="text-md text-gray-500">
                {totalVotes} vote{totalVotes > 1 ? "s" : ""}
              </div>
            )}
          </div>
          <div className="max-h-[100%] overflow-y-scroll">
            <div className="flex flex-col gap-2">
              {(data?.pollQuestion?.options as string[])?.map(
                (option, index) => {
                  if (data?.isOwner || data?.vote) {
                    return (
                      <div
                        key={index}
                        className="poll-result slide-in flex justify-between bg-gray-200 rounded px-4 py-2"
                        style={{
                          animationDelay: `${index * 0.15 + 0.5}s`,
                          fontWeight:
                            data.vote?.choice === index ? "700" : "300",
                        }}
                      >
                        <div
                          className="width"
                          style={{
                            width: `${
                              ((data?.votes?.[index]?._count ?? 0) * 100) /
                              totalVotes
                            }%`,
                          }}
                        ></div>
                        <div>{(option as any).text}</div>
                        <div>{data?.votes?.[index]?._count ?? 0} votes</div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={index}
                      className="poll-result slide-in flex justify-between bg-gray-200 rounded px-4 py-2"
                      style={{
                        animationDelay: `${index * 0.15 + 0.5}s`,
                      }}
                      onClick={() => {
                        mutate({
                          questionId: data.pollQuestion!.id,
                          option: index,
                        });
                      }}
                    >
                      {(option as any).text}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Question not found.</div>;
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
