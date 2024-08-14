import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { SpinnerPage } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Question {
  question: string;
  marks: number;
  type: string;
  // Remove the 'id' property if it's not present in QuestionType
}

const GenerateQuestions = () => {
  const { query } = useRouter();
  const documentId = query?.docId as string;

  const [inputText, setInputText] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState<Question[]>([]);

  const {
    data: questions,
    isLoading,
    isError,
  } = api.question.getQuestions.useQuery({ documentId });

  const { mutate: generateResponse, isLoading: isGeneratingResponse } =
    api.question.generateResponse.useMutation({
      onSuccess: (data: Question[]) => {
        setGeneratedResponse(data);
      },
      onError: (err: any) => {
        toast.error(err.message, {
          duration: 3000,
        });
      },
    });

  if (isLoading) return <SpinnerPage />;
  if (isError || !questions) return <div>Something went wrong</div>;

  return (
    <div className="h-full flex flex-col space-y-4 p-4">
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ask a Question:</h2>
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here..."
            className="flex-grow"
          />
          <Button
            onClick={() => {
              generateResponse({ documentId, question: inputText });
            }}
            disabled={isGeneratingResponse}
          >
            {isGeneratingResponse ? "Generating..." : "Ask"}
          </Button>
        </div>
        {generatedResponse.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
            <div className="space-y-2">
              {generatedResponse.map((question, index) => (
                <div key={index} className="p-2 bg-white rounded">
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                  {question.marks && <p><strong>Marks:</strong> {question.marks}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
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