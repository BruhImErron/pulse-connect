import { useEffect, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useSpring(0, { stiffness: 800, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 800, damping: 40 });
  const ringX = useSpring(0, { stiffness: 300, damping: 30 });
  const ringY = useSpring(0, { stiffness: 300, damping: 30 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    ringX.set(e.clientX);
    ringY.set(e.clientY);
    if (!visible) setVisible(true);
  }, [cursorX, cursorY, ringX, ringY, visible]);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    
    const handleOver = () => setHovering(true);
    const handleOut = () => setHovering(false);

    const observe = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]").forEach(el => {
        el.addEventListener("mouseenter", handleOver);
        el.addEventListener("mouseleave", handleOut);
      });
    };

    observe();
    const observer = new MutationObserver(observe);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, [onMouseMove]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: 6,
          height: 6,
          backgroundColor: "hsl(357, 100%, 44.5%)",
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border-2"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: hovering ? "hsla(357, 100%, 50%, 0.6)" : "hsla(357, 100%, 44.5%, 0.4)",
          backgroundColor: hovering ? "hsla(357, 100%, 44.5%, 0.1)" : "transparent",
        }}
        animate={{
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </>
  );
};

export default CustomCursor;
