import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Send,
  Bot,
  User as UserIcon,
  Plus,
  Trash2,
  MessageSquare,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const suggestions = [
  "What should I focus on this week?",
  "How do I prepare for my target company?",
  "Suggest a project for my resume",
];

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadList = async () => {
    try {
      const { data } = await api.get("/ai/conversations");
      setConversations(data);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (user) loadList();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  if (!user) return <Navigate to="/login" />;

  const firstName = user.name.split(" ")[0];

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setInput("");
  };

  const openChat = async (id) => {
    if (id === activeId) return;
    try {
      const { data } = await api.get(`/ai/conversations/${id}`);
      setActiveId(id);
      setMessages(data.messages);
    } catch (err) {
      // ignore
    }
  };

  const removeChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this chat?")) return;
    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations((list) => list.filter((c) => c._id !== id));
      if (id === activeId) newChat();
    } catch (err) {
      // ignore
    }
  };

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    const updated = [...messages, { role: "user", text: content }];
    setMessages(updated);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/ai/chat", {
        conversationId: activeId,
        message: content,
      });
      setMessages([...updated, { role: "model", text: data.reply }]);
      if (!activeId) setActiveId(data.conversationId);
      loadList();
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
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-6 h-screen flex gap-4">
      <aside className="hidden md:flex w-64 shrink-0 flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md p-3">
        <button
          onClick={newChat}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 hover:opacity-90 transition"
        >
          <Plus size={16} /> New chat
        </button>

        <div className="mt-3 flex-1 overflow-y-auto space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-500 text-center mt-4">
              No saved chats yet
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => openChat(c._id)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                c._id === activeId
                  ? "bg-violet-500/15 text-violet-600 dark:text-violet-300"
                  : "hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="flex-1 truncate">{c.title}</span>
              <button
                onClick={(e) => removeChat(c._id, e)}
                aria-label="Delete chat"
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Career Mentor</h1>
            <p className="text-sm text-slate-500">
              Knows your profile and roadmap progress.
            </p>
          </div>
          <button
            onClick={newChat}
            className="md:hidden inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-white/20"
          >
            <Plus size={14} /> New
          </button>
        </div>

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
    </div>
  );
}
