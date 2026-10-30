import { useContext, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Minus, Send, ShoppingCart, X } from "lucide-react";
import api from "../Api/axios.js";
import { ShopContext } from "../Context/ShopContext.jsx";

const STARTER_MESSAGE = {
  role: "assistant",
  content: "Hi! I can help you find groceries, compare options, and build your basket. What are you shopping for?",
  recommendations: [],
};

const SUGGESTIONS = ["Quick breakfast ideas", "Find cooking essentials", "Show milk options"];

export default function ShoppingAssistant() {
  const { addToCart, currency = "₹" } = useContext(ShopContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([STARTER_MESSAGE]);
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const sendMessage = async (value = input) => {
    const text = value.trim();
    if (!text || sending) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    try {
      const response = await api.post("/api/assistant/chat", {
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [...current, {
        role: "assistant",
        content: response.data.reply,
        recommendations: response.data.recommendations || [],
      }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: "assistant",
        content: error.response?.data?.message || "I couldn't reply just now. Please try again.",
        recommendations: [],
      }]);
    } finally {
      setSending(false);
    }
  };

  const toggle = () => {
    setOpen((value) => !value);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  };

  return (
    <aside className="fixed bottom-5 right-5 z-[80]" aria-label="Shopping assistant">
      {open && (
        <section className="mb-3 flex h-[min(590px,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl shadow-slate-900/20">
          <header className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15"><Bot size={20} /></span><div><h2 className="text-sm font-bold">GroceCart Assistant</h2><p className="text-xs text-emerald-100">Find the right items faster</p></div></div>
            <button type="button" onClick={toggle} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Close assistant"><X size={19} /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3.5">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={message.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-md bg-emerald-600 px-3.5 py-2.5 text-sm leading-5 text-white" : "max-w-[92%] rounded-2xl rounded-bl-md border border-slate-100 bg-white px-3.5 py-2.5 text-sm leading-5 text-slate-700 shadow-sm"}>
                  <p>{message.content}</p>
                  {message.recommendations?.length > 0 && <div className="mt-3 space-y-2">{message.recommendations.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 p-2.5">
                      <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{product.name}</p><p className="mt-0.5 text-xs font-semibold text-emerald-700">{currency}{product.price}{product.quantity ? ` · ${product.quantity}` : ""}</p></div>
                      <button type="button" onClick={() => addToCart(product.id, "standard")} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"><ShoppingCart size={13} /> Add</button>
                    </div>
                  ))}</div>}
                </div>
              </div>
            ))}
            {sending && <div className="flex justify-start"><span className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-xs text-slate-500 shadow-sm"><Loader2 size={14} className="animate-spin" /> Looking through the shop…</span></div>}
          </div>

          {messages.length === 1 && <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-3 pt-3">{SUGGESTIONS.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">{suggestion}</button>)}</div>}
          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder="Ask about groceries…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            <button type="submit" disabled={!input.trim() || sending} className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={17} /></button>
          </form>
        </section>
      )}
      <button type="button" onClick={toggle} className="ml-auto flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-900/25 transition hover:bg-emerald-700 active:scale-95" aria-expanded={open}>
        {open ? <Minus size={19} /> : <MessageCircle size={19} />} <span>{open ? "Minimize" : "Ask GroceCart"}</span>
      </button>
    </aside>
  );
}
