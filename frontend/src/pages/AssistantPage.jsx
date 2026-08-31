import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Bot,
  Send,
  Loader2,
  FileText,
  User,
  Sparkles,
} from "lucide-react";

import { askAssistant, getAISummary } from "../services/api";
import { useTender } from "../context/TenderContext";

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

  useEffect(() => {
    if (filename && !aiSummary) {
      fetchSummary();
    }
  }, [filename]);

  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);

      const data = await getAISummary(filename);

      setAISummary(data.summary || "AI summary unavailable.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      text: question,
    };

    setChatHistory((prev) => [...prev, userMessage]);

    try {
      setLoadingChat(true);

      const response = await askAssistant(filename, question);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer,
        },
      ]);

      setQuestion("");
    } catch (err) {
      console.error(err);

      toast.error("Assistant failed to respond.");

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to answer at the moment.",
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <Bot size={60} className="mx-auto text-gray-400 mb-4" />

        <h2 className="text-2xl font-bold text-gray-700">
          AI Assistant is Ready
        </h2>

        <p className="text-gray-500 mt-2">
          Upload and analyze a tender to start chatting with the BIS AI Assistant.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-[#003366] to-[#0055AA] text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <Bot size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              BIS AI Procurement Assistant
            </h1>

            <p className="mt-2 text-blue-100">
              Ask questions about uploaded tenders, BIS clauses, standards, and compliance gaps.
            </p>
          </div>
        </div>
      </div>

      {/* AI Summary */}

      <div className="bg-white rounded-3xl shadow-lg p-7">
        <div className="flex items-center gap-3 mb-5">
          <Sparkles className="text-blue-700" />

          <h2 className="text-2xl font-bold text-[#003366]">
            AI Tender Summary
          </h2>
        </div>

        {loadingSummary ? (
          <div className="flex items-center gap-3 text-blue-700">
            <Loader2 className="animate-spin" />
            Generating AI summary...
          </div>
        ) : (
          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {aiSummary}
          </p>
        )}
      </div>

      {/* Chat Window */}

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <FileText className="text-green-700" />

          <h2 className="text-xl font-bold text-[#003366]">
            Ask Procurement Questions
          </h2>
        </div>

        <div className="h-[420px] overflow-y-auto border rounded-2xl bg-slate-50 p-5 space-y-5">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-400 mt-24">
              Start asking questions about this tender...
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${
                    msg.role === "user"
                      ? "bg-[#003366] text-white"
                      : "bg-white border text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} className="text-green-600" />
                    )}

                    <span className="text-xs font-semibold uppercase">
                      {msg.role}
                    </span>
                  </div>

                  <p className="leading-6 whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}

        <div className="mt-5 flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Which BIS clauses are missing in this tender?"
            className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />

          <button
            onClick={handleAsk}
            disabled={loadingChat}
            className="bg-[#003366] hover:bg-[#002244] text-white px-5 rounded-xl flex items-center gap-2 disabled:opacity-60"
          >
            {loadingChat ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}

            Send
          </button>
        </div>
      </div>

      {/* Suggested Questions */}

      <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6">
        <h3 className="font-bold text-blue-700 mb-4">
          Suggested Questions
        </h3>

        <div className="flex flex-wrap gap-3">
          {[
            "Summarize this tender.",
            "Which BIS clauses are missing?",
            "Explain the compliance score.",
            "Why is IS 10322 recommended?",
            "List all mandatory BIS standards.",
            "How can this tender become fully compliant?",
          ].map((q, index) => (
            <button
              key={index}
              onClick={() => setQuestion(q)}
              className="bg-white px-4 py-2 rounded-full border hover:bg-blue-100 transition text-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}