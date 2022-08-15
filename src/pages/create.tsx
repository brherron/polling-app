import React, { useState } from "react";
import { trpc } from "../utils/trpc";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";

const CreateQuestionForm = () => {
  const router = useRouter();
  const [endingTime, setEndingTime] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Green Bay Packers" }, { text: "Pittsburg Steelers" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onBack = () => {
    router.push("/");
  };

  if (isLoading || data) return <Spinner />;

  return (
    <div className="antialiased my-12">
      <div className="max-w-xl mx-auto md:max-w-4xl">
        <div className="text-5xl font-bold">Create Poll</div>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (endingTime > 0) {
                const endingDate = new Date();
                endingDate.setHours(endingDate.getHours() + endingTime);

                data.endingTime = endingDate;
              }

              await mutate(data);
            } catch (error) {
              console.log(error);
            }
          })}
        >
          <div className="mt-8 grid grid-cols-1 items-start">
            <div className="grid grid-cols-1">
              <label className="block">
                <div className="text-xl my-2 text-gray-600">Question</div>
                <input
                  {...register("question")}
                  type="text"
                  className="form-input text-sm rounded border-2 border-gray-300 text-gray-800 px-4 py-2 mt-1 block w-full"
                  placeholder="Who won Super Bowl XLV?"
                />
              </label>
            </div>
            {errors.question && (
              <p className="text-red-400">{errors.question.message}</p>
            )}
            <div className="mt-6 flex flex-col">
              <div className="text-xl my-2 text-gray-600">Expiration</div>
              <div className="w-1/2 grid grid-cols-4">
                <button
                  type="button"
                  className={`text-sm rounded py-2 px-4 mr-2 font-bold transition uppercase ${
                    endingTime === 4
                      ? "bg-[#888fd2]/60 text-white"
                      : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setEndingTime(4)}
                >
                  4h
                </button>
                <button
                  type="button"
                  className={`text-sm rounded py-2 px-4 mr-2 font-bold transition uppercase ${
                    endingTime === 8
                      ? "bg-[#888fd2]/60 text-white"
                      : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setEndingTime(8)}
                >
                  8h
                </button>
                <button
                  type="button"
                  className={`text-sm rounded py-2 px-4 mr-2 font-bold transition uppercase ${
                    endingTime === 12
                      ? "bg-[#888fd2]/60 text-white"
                      : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setEndingTime(12)}
                >
                  12h
                </button>
                <button
                  type="button"
                  className={`text-sm rounded py-2 px-4 mr-2 font-bold transition uppercase ${
                    endingTime === 24
                      ? "bg-[#888fd2]/60 text-white"
                      : "bg-gray-100 hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setEndingTime(24)}
                >
                  24h
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-col w-1/2">
              <div className="text-xl my-2 text-gray-600">Include Options</div>
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className="transition">
                    <section
                      className="section flex items-center gap-2"
                      key={field.id}
                    >
                      <input
                        placeholder="name"
                        {...register(`options.${index}.text` as const, {
                          required: true,
                        })}
                        className="form-input text-sm rounded border-2 border-gray-300 text-gray-800 px-4 py-2 mt-1 block w-full"
                      />
                      <button
                        className="flex justify-center items-center bg-gray-200 hover:bg-red-200 p-1 w-6 aspect-square rounded-full text-xs text-white font-bold transition"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        X
                      </button>
                    </section>
                  </div>
                );
              })}
              {fields.length < 8 && (
                <button
                  className="text-2xl my-4 text-gray-600 transition"
                  type="button"
                  onClick={() =>
                    append({
                      text: "Another option",
                    })
                  }
                >
                  +
                </button>
              )}
              {errors.options && (
                <p className="text-red-400">{errors.options.message}</p>
              )}
            </div>
            <div className="flex my-8">
              <button
                type="button"
                className="form-input text-sm text-gray-800 rounded bg-gray-100 py-2 px-4 mr-2 hover:bg-gray-100 font-bold transition"
                onClick={onBack}
              >
                BACK
              </button>
              <button
                type="submit"
                className="form-input text-sm text-white rounded bg-[#888fd2]/60 py-2 px-4 mr-2 hover:bg-gray-100 font-bold transition"
              >
                CREATE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC = () => {
  return <CreateQuestionForm />;
};

export default QuestionCreator;
