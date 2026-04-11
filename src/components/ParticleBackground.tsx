import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
}

interface ParticleBackgroundProps {
  variant?: "hero" | "dashboard" | "default";
  particleCount?: number;
}

const ParticleBackground = ({ variant = "default", particleCount = 80 }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const getColor = useCallback(() => {
    if (variant === "hero") return { r: 227, g: 0, b: 15 };
    if (variant === "dashboard") return { r: 227, g: 0, b: 15 };
    return { r: 227, g: 0, b: 15 };
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const x = Math.random() * w();
      const y = Math.random() * h();
      return {
        x, y,
        baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
      };
    });

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleTouch);
    canvas.addEventListener("mouseleave", handleLeave);

    const color = getColor();
    const maxDist = 150;
    const mouseRadius = 120;

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Mouse interaction: orbit/repel
        const dmx = mx - p.x;
        const dmy = my - p.y;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        
        if (distMouse < mouseRadius && distMouse > 0) {
          if (variant === "hero") {
            // Orbit effect
            const angle = Math.atan2(dmy, dmx);
            const force = (mouseRadius - distMouse) / mouseRadius;
            p.vx += Math.cos(angle + Math.PI / 2) * force * 0.3;
            p.vy += Math.sin(angle + Math.PI / 2) * force * 0.3;
            // Attraction
            p.vx += dmx * 0.001;
            p.vy += dmy * 0.001;
          } else {
            // Gentle repulsion
            const force = (mouseRadius - distMouse) / mouseRadius;
            p.vx -= (dmx / distMouse) * force * 0.5;
            p.vy -= (dmy / distMouse) * force * 0.5;
          }
        }

        // Return to base gently
        p.vx += (p.baseX - p.x) * 0.001;
        p.vy += (p.baseY - p.y) * 0.001;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = w();
        if (p.x > w()) p.x = 0;
        if (p.y < 0) p.y = h();
        if (p.y > h()) p.y = 0;

        // Draw particle
        const alpha = distMouse < mouseRadius ? 0.8 : 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        const dmx = mx - particles[i].x;
        const dmy = my - particles[i].y;
        const distM = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distM < mouseRadius * 1.5) {
          const alpha = (1 - distM / (mouseRadius * 1.5)) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [variant, particleCount, getColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: "none" }}
    />
  );
};

export default ParticleBackground;
