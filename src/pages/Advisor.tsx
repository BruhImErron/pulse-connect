import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Rocket, User } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const prompts = [
  "How can I improve my sleep quality?",
  "What are the best foods for immunity?",
  "How to manage stress during exams?",
  "Tips for staying hydrated?",
  "Best exercises for desk workers?",
  "How to build a morning routine?",
];

const aiResponses: Record<string, string> = {
  "How can I improve my sleep quality?": "Great question! Here are evidence-based tips:\n\n1. **Consistent schedule** — Sleep and wake at the same time daily\n2. **Blue light filter** — Avoid screens 1hr before bed\n3. **Cool room** — Keep your bedroom at 65-68°F (18-20°C)\n4. **No caffeine after 2pm** — It has a 6-hour half-life\n5. **Relaxation routine** — Try 4-7-8 breathing technique\n\nWant me to create a personalized sleep plan for you?",
  default: "That's a great health question! Based on current medical guidelines, I'd recommend consulting with your local healthcare provider for personalized advice. In the meantime, I can share some general wellness tips:\n\n1. Stay hydrated (8 glasses/day)\n2. Get 30 min of daily exercise\n3. Eat a balanced diet rich in fruits & vegetables\n4. Prioritize 7-9 hours of sleep\n\nWould you like me to go deeper on any of these topics?",
};

interface Message {
  role: "user" | "ai";
  content: string;
}

const Advisor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowPrompts(false);
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const response = aiResponses[text] || aiResponses.default;
      setMessages(prev => [...prev, { role: "ai", content: response }]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot size={24} strokeWidth={1.5} className="text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">AI Health Advisor</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Powered by Llama 3.2</span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span>Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {/* Suggested prompts */}
          <AnimatePresence>
            {showPrompts && (
              <motion.div
                className="grid grid-cols-2 gap-2"
                exit={{ opacity: 0, height: 0 }}
              >
                {prompts.map((p, i) => (
                  <motion.button
                    key={p}
                    className="text-left p-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => sendMessage(p)}
                    whileHover={{ scale: 1.01 }}
                    data-cursor-hover
                  >
                    {p}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" ? "bg-primary" : "bg-secondary"
              }`}>
                {m.role === "user" ? (
                  <User size={14} className="text-primary-foreground" />
                ) : (
                  <Bot size={14} className="text-foreground" />
                )}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "glass-card rounded-tl-none text-foreground"
              }`}>
                {m.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot size={14} className="text-foreground" />
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border pt-4">
          <div className="flex items-end gap-3">
            <textarea
              className="flex-1 bg-input border border-border rounded-2xl px-4 py-3 text-sm text-foreground resize-none focus:border-primary focus:outline-none transition-colors"
              placeholder="Ask me anything about health..."
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <motion.button
              className="p-3 rounded-2xl bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(input)}
              data-cursor-hover
            >
              <Rocket size={18} strokeWidth={1.5} />
            </motion.button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Running locally • Private</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Advisor;
