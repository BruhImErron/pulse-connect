import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Link as LinkIcon, Megaphone, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Post } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Feed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [composerFocused, setComposerFocused] = useState(false);
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.posts.list().then(res => res.data.posts),
  });

  const createPostMutation = useMutation({
    mutationFn: (content: string) => api.posts.create(content).then(res => res.data.post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPost("");
      setComposerFocused(false);
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => api.posts.like(postId).then(res => ({ postId, liked: res.data.liked })),
    onSuccess: ({ postId, liked }) => {
      queryClient.setQueryData(["posts"], (oldData: Post[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(post =>
          post.id === postId
            ? { ...post, _count: { likes: post._count.likes + (liked ? 1 : -1) } }
            : post
        );
      });
    },
  });

  const handleCreatePost = () => {
    if (newPost.trim()) {
      createPostMutation.mutate(newPost.trim());
    }
  };

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const posts = postsData || [];

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
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
              {user?.avatarInitial ?? "A"}
            </div>
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
                onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleCreatePost()}
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
                      className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      data-cursor-hover
                      onClick={handleCreatePost}
                      disabled={createPostMutation.isPending || !newPost.trim()}
                    >
                      {createPostMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Share Story 🚀"
                      )}
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
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {post.author.avatarInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{post.author.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-accent text-accent-foreground">{post.author.role}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-6">
                <motion.button
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => handleLike(post.id)}
                  whileTap={{ scale: 0.9 }}
                  data-cursor-hover
                  disabled={likeMutation.isPending}
                >
                  <Heart size={16} strokeWidth={1.5} />
                  <span>{post._count.likes}</span>
                </motion.button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
                  <MessageCircle size={16} strokeWidth={1.5} /> 0
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
