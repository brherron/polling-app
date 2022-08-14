import React from "react";
import { trpc } from "../utils/trpc";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { useRouter } from "next/router";

const CreateQuestionForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Yes" }, { text: "No" }],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "options",
      control,
    }
  );

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="antialiased text-gray-100 px-6">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="text-2xl font-bold">Reset styles</h2>
        <p className="mt-2 text-lg text-gray-300">
          These are form elements this plugin styles by default.
        </p>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
        >
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="grid grid-cols-1 gap-6 col-span-2">
              <label className="block">
                <span className="text-gray-200">Question</span>
                <input
                  {...register("question")}
                  type="text"
                  className="form-input text-sm rounded text-gray-800 px-4 py-2 mt-1 block w-full"
                  placeholder="Who won Super Bowl XLV?"
                />
              </label>
            </div>
            {errors.question && (
              <p className="text-red-400">{errors.question.message}</p>
            )}
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className={"section"} key={field.id}>
                    <input
                      placeholder="name"
                      {...register(`options.${index}.text` as const, {
                        required: true,
                      })}
                      className="form-input mt-1 block w-full text-gray-800 py-1 px-3"
                    />
                    <button type="button" onClick={() => remove(index)}>
                      DELETE
                    </button>
                  </section>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                append({
                  text: "Another option",
                })
              }
            >
              ADD
            </button>
            <div className="grid grid-cols-2 gap-6 col-span-2">
              <button
                type="submit"
                className="form-input text-sm text-gray-900 rounded bg-gray-400 p-2 hover:bg-gray-100 transition"
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
