import { Bot, User } from "lucide-react";

export default function ChatBubble({ type, children }) {
  const isBot = type === "bot";

  return (
    <div className={`flex gap-4 mb-6 ${isBot ? "" : "justify-end"}`}>
      {isBot && (
        <div className="bg-green-600 p-3 rounded-full text-white">
          <Bot size={20}/>
        </div>
      )}

      <div
        className={`max-w-3xl rounded-2xl px-6 py-4 shadow ${
          isBot
            ? "bg-white text-gray-700"
            : "bg-green-600 text-white"
        }`}
      >
        {children}
      </div>

      {!isBot && (
        <div className="bg-slate-700 p-3 rounded-full text-white">
          <User size={20}/>
        </div>
      )}
    </div>
  );
}