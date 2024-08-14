import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SpinnerPage } from "@/components/ui/spinner";

interface Question {
  question: string;
  marks: number;
  type: string;
}

const GenerateQuestions = () => {
  const { query } = useRouter();
  const documentId = query?.docId as string;
  // const f=query?.result.title as String;
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const {
    data: questions,
    isLoading,
    isError,
  } = api.question.getQuestions.useQuery({ documentId });

  const { mutate: generateResponse, isLoading: isGeneratingQuestions } =
    api.question.generateResponse.useMutation({
      onSuccess: (data: Question[]) => {
        setGeneratedQuestions(data);
      },
      onError: (err: any) => {
        toast.error(err.message, {
          duration: 3000,
        });
      },
    });

  useEffect(() => {
    if (documentId) {
      generateResponse({ documentId,question: `Give me two marks and five marks questions` });
    }
   

  }, [documentId]);

  if (isLoading || isGeneratingQuestions) return <SpinnerPage />;
  if (isError || !questions) return <div>Something went wrong</div>;

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Here Are the Some of the 2 mark and 5 mark Questions :</h2>
        <h2 className="text-xl font-bold mb-4">Generated Questions:</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2 Mark Questions:</h3>
            {generatedQuestions
              .filter(q => q.marks === 2)
              .map((question, index) => (
                <div key={index} className="p-2 bg-white rounded shadow">
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                </div>
              ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">5 Mark Questions:</h3>
            {generatedQuestions
              .filter(q => q.marks === 5)
              .map((question, index) => (
                <div key={index} className="p-2 bg-white rounded shadow">
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-bold">Previously Generated Questions:</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2 Mark Questions:</h3>
            {questions.filter(q => q.marks === 2).map((q, index) => (
              <div key={q.id} className="p-2 bg-gray-100 rounded">
                {index + 1}. {q.question}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">5 Mark Questions:</h3>
            {questions.filter(q => q.marks === 5).map((q, index) => (
              <div key={q.id} className="p-2 bg-gray-100 rounded">
                {index + 1}. {q.question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQuestions;
