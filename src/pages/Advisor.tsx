import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Rocket, User, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const prompts = [
  "How can I improve my sleep quality?",
  "What are the best foods for immunity?",
  "How to manage stress during exams?",
  "Tips for staying hydrated?",
  "Best exercises for desk workers?",
  "How to build a morning routine?",
];

interface Message {
  role: "user" | "ai";
  content: string;
  id?: string;
  pending?: boolean;
}

const Advisor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showPrompts, setShowPrompts] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const pendingMessageId = useRef<string | null>(null);
  const { toast } = useToast();

  const askMutation = useMutation({
    mutationFn: (message: string) => api.advisor.ask(message).then(res => res.data.reply),
    onError: (error) => {
      toast({
        title: "Advisor error",
        description: error instanceof Error ? error.message : "Unable to reach the advisor service.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(message => !message.pending));
      pendingMessageId.current = null;
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, askMutation.isPending]);

  const quickReplies: Record<string, string> = {
    "how can i improve my sleep quality?": "Good sleep starts with a simple routine. Try a consistent bedtime, a screen-free wind-down period, and keep your room cool and dark. If your energy still feels low, focus on small changes you can keep doing every day.",
    "what are the best foods for immunity?": "Focus on whole foods: colorful fruits and vegetables, lean protein, healthy fats, and fermented foods. A balanced plate and consistent hydration are more important than any single superfood.",
    "how to manage stress during exams?": "Break the day into short work blocks, add breathing breaks, and make time for sleep. Small wins matter; focus on one task at a time and reward yourself after progress.",
    "tips for staying hydrated?": "Carry water, drink at regular intervals, and include water-rich foods like fruit and soups. Pay attention to your body's cues and avoid sugary drinks if you want sustained hydration.",
    "best exercises for desk workers?": "Use short stretch breaks, gentle mobility moves, and quick walks to reset posture. Focus on the neck, shoulders, hips, and lower back to reduce tension from sitting.",
    "how to build a morning routine?": "Start with one consistent action like a short walk, stretch session, or a glass of water. Keep it simple, then add new healthy steps once the first habit is established.",
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || askMutation.isPending) return;
    
    // Clear input immediately to prevent double-sends
    setInput("");
    setShowPrompts(false);
    
    const placeholderId = `pending-${Date.now()}`;
    pendingMessageId.current = placeholderId;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, id: `user-${Date.now()}` },
      { role: "ai", content: "Thinking...", id: placeholderId, pending: true },
    ]);

    const normalized = text.trim().toLowerCase();
    const quickReply = quickReplies[normalized];
    if (quickReply) {
      setMessages((prev) => prev.map((message) =>
        message.id === placeholderId
          ? { ...message, content: quickReply, pending: false }
          : message
      ));
      pendingMessageId.current = null;
      return;
    }

    askMutation.mutate(text, {
      onSuccess: (reply) => {
        if (pendingMessageId.current) {
          setMessages((prev) => prev.map((message) =>
            message.id === pendingMessageId.current
              ? { ...message, content: reply, pending: false }
              : message
          ));
          pendingMessageId.current = null;
        } else {
          setMessages((prev) => [...prev, { role: "ai", content: reply }]);
        }
      },
      onError: () => {
        if (pendingMessageId.current) {
          setMessages((prev) => prev.map((message) =>
            message.id === pendingMessageId.current
              ? { ...message, content: "Sorry, I couldn't get the answer quickly. Try again in a moment or use one of the suggested prompts.", pending: false }
              : message
          ));
          pendingMessageId.current = null;
        }
      },
    });
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
                    className="text-left p-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => sendMessage(p)}
                    whileHover={{ scale: askMutation.isPending ? 1 : 1.01 }}
                    data-cursor-hover
                    disabled={askMutation.isPending}
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
            {askMutation.isPending && (
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
              className="flex-1 bg-input border border-border rounded-2xl px-4 py-3 text-sm text-foreground resize-none focus:border-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={askMutation.isPending}
            />
            <motion.button
              className="p-3 rounded-2xl bg-primary text-primary-foreground disabled:opacity-50"
              whileHover={{ scale: askMutation.isPending ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(input)}
              data-cursor-hover
              disabled={askMutation.isPending || !input.trim()}
            >
              {askMutation.isPending ? (
                <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <Rocket size={18} strokeWidth={1.5} />
              )}
            </motion.button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Running locally • Private</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Advisor;
