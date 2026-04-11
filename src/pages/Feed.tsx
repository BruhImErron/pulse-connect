import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Link as LinkIcon, Megaphone } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const initialPosts = [
  { id: 1, author: "Priya Sharma", role: "Volunteer", initial: "P", color: "bg-primary", content: "Just finished an incredible health camp in rural Maharashtra! 200+ patients treated today. The gratitude in their eyes makes every hour worth it. 🏥❤️", likes: 42, comments: 8, time: "2h ago", liked: false },
  { id: 2, author: "David Chen", role: "Donor", initial: "D", color: "bg-info", content: "Shipped 100 medical kits to MedAid International today! Tracking shows they'll arrive in Nairobi by Friday. Every kit counts! 📦", likes: 31, comments: 5, time: "4h ago", liked: false },
  { id: 3, author: "Amara Obi", role: "NGO Lead", initial: "A", color: "bg-success", content: "Our clean water initiative reached 5,000 families this month! Thank you PulsePoint volunteers for making this possible. 🌊", likes: 89, comments: 15, time: "6h ago", liked: false },
  { id: 4, author: "Maria Rodriguez", role: "Volunteer", initial: "M", color: "bg-warning", content: "Earned my 100 Hours badge today! Started as a weekend volunteer, now it's become my calling. Who else is on their way? 🏆", likes: 56, comments: 12, time: "8h ago", liked: false },
];

const Feed = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [composerFocused, setComposerFocused] = useState(false);

  const toggleLike = (id: number) => {
    setPosts(p => p.map(post =>
      post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };

  return (
    <DashboardLayout>
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-8">
          <Megaphone size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Feed</h1>
        </div>

        {/* Composer */}
        <motion.div className="glass-card p-5 mb-8" layout>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">A</div>
            <div className="flex-1">
              <motion.textarea
                className="w-full bg-transparent text-foreground text-sm resize-none focus:outline-none placeholder:text-muted-foreground"
                placeholder="Share your story..."
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                onFocus={() => setComposerFocused(true)}
                onBlur={() => !newPost && setComposerFocused(false)}
                animate={{ height: composerFocused ? 80 : 40 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence>
                {composerFocused && (
                  <motion.div
                    className="flex items-center justify-between mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <span className="text-xs text-muted-foreground">{newPost.length}/500</span>
                    <motion.button
                      className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
                    >
                      Share Story 🚀
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              className="glass-card p-5 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ borderColor: "hsla(357,100%,44.5%,0.15)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-full ${post.color} flex items-center justify-center text-primary-foreground text-sm font-bold`}>
                  {post.initial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{post.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-accent text-accent-foreground">{post.role}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{post.time}</span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-6">
                <motion.button
                  className={`flex items-center gap-1.5 text-sm ${post.liked ? "text-primary" : "text-muted-foreground"} hover:text-primary transition-colors`}
                  onClick={() => toggleLike(post.id)}
                  whileTap={{ scale: 0.9 }}
                  data-cursor-hover
                >
                  <Heart size={16} strokeWidth={1.5} fill={post.liked ? "currentColor" : "none"} />
                  <motion.span key={post.likes} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    {post.likes}
                  </motion.span>
                </motion.button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
                  <MessageCircle size={16} strokeWidth={1.5} /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
                  <LinkIcon size={16} strokeWidth={1.5} /> Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Feed;
