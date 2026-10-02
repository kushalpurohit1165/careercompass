import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { Send, Bot, User as UserIcon } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const suggestions = [
  "What should I focus on this week?",
  "How do I prepare for my target company?",
  "Suggest a project for my resume",
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (!user) return <Navigate to="/login" />;

  const firstName = user.name.split(" ")[0];

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    const updated = [...messages, { role: "user", text: content }];
    setMessages(updated);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/ai/chat", { messages: updated });
      setMessages([...updated, { role: "model", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          role: "model",
          text:
            err.response?.data?.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold">AI Career Mentor</h1>
      <p className="text-sm text-slate-500">
        Knows your profile and roadmap progress.
      </p>

      <div className="mt-4 flex-1 overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-linear-to-br from-violet-500 to-cyan-400">
              <Bot size={28} />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Hi {firstName}!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ask me anything about your career. Try one of these:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-4 py-2 rounded-full text-sm border border-violet-500/40 text-violet-500 hover:bg-violet-500/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              m.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                m.role === "user"
                  ? "bg-slate-500"
                  : "bg-linear-to-br from-violet-500 to-cyan-400"
              }`}
            >
              {m.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-linear-to-r from-violet-500 to-cyan-500 text-white"
                  : "bg-slate-100 dark:bg-white/10"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white bg-linear-to-br from-violet-500 to-cyan-400">
              <Bot size={16} />
            </div>
            <div className="px-4 py-2.5 rounded-2xl text-sm bg-slate-100 dark:bg-white/10 text-slate-500">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your career mentor..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 outline-none focus:border-violet-500 transition"
        />
        <button
          disabled={sending || !input.trim()}
          className="px-5 rounded-xl text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
