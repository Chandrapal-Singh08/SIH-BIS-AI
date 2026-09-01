import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

import { useTender } from "../context/TenderContext";
import {
  getAISummary,
  askAssistant,
} from "../services/api";

export default function AssistantPage() {
  const {
    filename,
    aiSummary,
    setAISummary,
    chatHistory,
    setChatHistory,
  } = useTender();

  const [question, setQuestion] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // ---------------- Summary ----------------

  useEffect(() => {
    if (!filename) return;

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);

        const res = await getAISummary(filename);

        setAISummary(res.summary);
      } catch (err) {
        toast.error("Unable to generate AI summary.");
      } finally {
        setLoadingSummary(false);
      }
    };

    if (!aiSummary) fetchSummary();
  }, [filename]);

  // ---------------- Chat ----------------

  const handleAsk = async () => {
    if (!filename) {
      toast.error("Upload a tender first.");
      return;
    }

    if (!question.trim()) return;

    const userQuestion = question;

    setChatHistory((prev) => [
      ...prev,
      { role: "user", message: userQuestion },
    ]);

    setQuestion("");

    try {
      setLoadingChat(true);

      const res = await askAssistant(filename, userQuestion);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          message: res.answer,
        },
      ]);
    } catch {
      toast.error("Gemini AI Assistant failed.");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="space-y-8">

      <div className="bg-[#003366] text-white rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <Bot size={34} />
          <h1 className="text-3xl font-bold">
            BIS AI Procurement Assistant
          </h1>
        </div>

        <p className="mt-3 text-blue-100">
          Ask questions about uploaded tenders, BIS clauses,
          standards, and compliance gaps.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="flex items-center gap-3 mb-5">
          <Sparkles className="text-blue-600" />
          <h2 className="text-2xl font-bold">
            AI Tender Summary
          </h2>
        </div>

        {loadingSummary ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" />
            Generating Summary...
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-5 whitespace-pre-wrap">
            {aiSummary || "Upload a tender to generate summary."}
          </div>
        )}

      </div>

      <div className="bg-white rounded-3xl shadow p-8">

        <h2 className="text-2xl font-bold mb-5">
          Ask Procurement Questions
        </h2>

        <div className="border rounded-xl h-[400px] overflow-y-auto p-4 bg-gray-50 space-y-4">

          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[80%] whitespace-pre-wrap ${
                  chat.role === "user"
                    ? "bg-[#003366] text-white"
                    : "bg-white border"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}

          {loadingChat && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Gemini is thinking...
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-3">

          <input
            className="flex-1 border rounded-xl px-4 py-3"
            placeholder="Ask something about this tender..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleAsk()
            }
          />

          <button
            onClick={handleAsk}
            disabled={loadingChat}
            className="bg-[#003366] text-white px-6 rounded-xl flex items-center gap-2"
          >
            {loadingChat ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            Ask
          </button>

        </div>
      </div>

    </div>
  );
}