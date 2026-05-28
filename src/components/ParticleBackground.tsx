import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
  density: number;
  angle: number;
  heartOffsetX: number;
  heartOffsetY: number;
}

interface ParticleBackgroundProps {
  variant?: "hero" | "dashboard" | "default";
  particleCount?: number;
}

const HEART_LOCK_DELAY = 260;

const ParticleBackground = ({ variant = "default", particleCount = 80 }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const longPressTimeoutRef = useRef<number | null>(null);
  const pressStateRef = useRef({
    isPressing: false,
    heartLock: false,
    flash: 0,
    shockwave: 0,
    releaseBurst: 0,
  });

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

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const createParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, (_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const progress = index / Math.max(1, particleCount - 1);
        const t = Math.PI * 2 * progress;
        const heartScale = variant === "hero" ? Math.min(width, height) * 0.0085 : 0;
        const heartX = 16 * Math.sin(t) ** 3 * heartScale;
        const heartY =
          -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;

        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          radius: Math.random() * 2.2 + 0.8,
          density: Math.random() * 20 + 10,
          angle: Math.random() * Math.PI * 2,
          heartOffsetX: heartX,
          heartOffsetY: heartY,
        };
      });
    };

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.touchAction = "none";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      createParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    const clearLongPress = () => {
      if (longPressTimeoutRef.current) {
        window.clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    };

    const handlePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const startPress = () => {
      if (variant !== "hero") return;
      pressStateRef.current.isPressing = true;
      clearLongPress();
      longPressTimeoutRef.current = window.setTimeout(() => {
        pressStateRef.current.heartLock = true;
      }, HEART_LOCK_DELAY);
    };

    const endPress = () => {
      if (variant !== "hero") return;
      const hadHeartLock = pressStateRef.current.heartLock;
      pressStateRef.current.isPressing = false;
      pressStateRef.current.heartLock = false;
      clearLongPress();

      if (hadHeartLock) {
        pressStateRef.current.flash = 1;
        pressStateRef.current.shockwave = 1;
        pressStateRef.current.releaseBurst = 1;
      }
    };

    const handleMouse = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handlePointer(touch.clientX, touch.clientY);
    };

    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      endPress();
    };

    const handleMouseDown = (e: MouseEvent) => {
      handlePointer(e.clientX, e.clientY);
      startPress();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handlePointer(touch.clientX, touch.clientY);
      startPress();
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleTouch, { passive: true });
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchend", handleLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", endPress);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });

    window.addEventListener("mouseup", endPress);
    window.addEventListener("touchend", endPress);

    const color = getColor();
    const baseConnectionDistance = variant === "hero" ? 145 : 110;
    const mouseRadius = variant === "hero" ? 205 : 110;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;
      const hasPointer = mx > -500 && my > -500;
      const pressState = pressStateRef.current;

      pressState.flash *= 0.9;
      pressState.shockwave *= 0.92;
      pressState.releaseBurst *= 0.9;

      if (hasPointer) {
        const glowRadius = pressState.heartLock ? mouseRadius * 1.35 : mouseRadius * 1.15;
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${pressState.heartLock ? 0.24 : 0.16})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.06)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        if (pressState.shockwave > 0.02) {
          const shockRadius = (1 - pressState.shockwave) * Math.max(width, height) * 0.45 + 20;
          ctx.beginPath();
          ctx.arc(mx, my, shockRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${pressState.shockwave * 0.4})`;
          ctx.lineWidth = 2 + pressState.shockwave * 10;
          ctx.stroke();
        }
      }

      for (const particle of particles) {
        particle.angle += 0.006;

        const dxMouse = mx - particle.x;
        const dyMouse = my - particle.y;
        const mouseDistance = Math.hypot(dxMouse, dyMouse);

        if (variant === "hero" && hasPointer && pressState.heartLock) {
          const targetX = mx + particle.heartOffsetX;
          const targetY = my + particle.heartOffsetY;
          const dxHeart = targetX - particle.x;
          const dyHeart = targetY - particle.y;
          const swirl = Math.atan2(dyHeart, dxHeart) + Math.PI / 2;
          const heartDistance = Math.max(1, Math.hypot(dxHeart, dyHeart));

          particle.vx += (dxHeart / heartDistance) * 0.45;
          particle.vy += (dyHeart / heartDistance) * 0.45;
          particle.vx += Math.cos(swirl) * 0.05;
          particle.vy += Math.sin(swirl) * 0.05;
        } else if (mouseDistance < mouseRadius && mouseDistance > 0) {
          const force = (mouseRadius - mouseDistance) / mouseRadius;
          const angle = Math.atan2(dyMouse, dxMouse);

          if (variant === "hero") {
            particle.vx += (dxMouse / mouseDistance) * force * 0.24;
            particle.vy += (dyMouse / mouseDistance) * force * 0.24;
            particle.vx += Math.cos(angle + Math.PI / 2) * force * 0.16;
            particle.vy += Math.sin(angle + Math.PI / 2) * force * 0.16;
          } else {
            particle.vx -= (dxMouse / mouseDistance) * force * 0.18;
            particle.vy -= (dyMouse / mouseDistance) * force * 0.18;
          }
        }

        if (pressState.releaseBurst > 0.02 && hasPointer) {
          const dxBurst = particle.x - mx;
          const dyBurst = particle.y - my;
          const burstDistance = Math.max(1, Math.hypot(dxBurst, dyBurst));
          const burstForce = pressState.releaseBurst * 0.85;
          particle.vx += (dxBurst / burstDistance) * burstForce;
          particle.vy += (dyBurst / burstDistance) * burstForce;
        }

        const returnForce = variant === "hero" && pressState.heartLock ? 0.0006 : 0.0018;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;

        particle.vx *= variant === "hero" && pressState.heartLock ? 0.9 : 0.965;
        particle.vy *= variant === "hero" && pressState.heartLock ? 0.9 : 0.965;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;

        const activeAlpha =
          variant === "hero" && pressState.heartLock
            ? 0.96
            : mouseDistance < mouseRadius
              ? 0.88
              : 0.25;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius + (pressState.heartLock ? 0.4 : 0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${activeAlpha})`;
        ctx.shadowBlur = variant === "hero" && (mouseDistance < mouseRadius || pressState.heartLock) ? 20 : 0;
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          const dynamicDistance = pressState.heartLock ? 110 : baseConnectionDistance;

          if (distance < dynamicDistance) {
            const alpha = (1 - distance / dynamicDistance) * (pressState.heartLock ? 0.28 : variant === "hero" ? 0.18 : 0.1);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            ctx.lineWidth = pressState.heartLock ? 1 : 0.7;
            ctx.stroke();
          }
        }

        const dxMouse = mx - particles[i].x;
        const dyMouse = my - particles[i].y;
        const mouseDistance = Math.hypot(dxMouse, dyMouse);

        if (hasPointer && mouseDistance < mouseRadius * 1.2) {
          const alpha = (1 - mouseDistance / (mouseRadius * 1.2)) * (pressState.heartLock ? 0.32 : 0.22);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.lineWidth = pressState.heartLock ? 1 : 0.8;
          ctx.stroke();
        }
      }

      if (variant === "hero" && hasPointer) {
        ctx.save();
        if (pressState.flash > 0.03) {
          ctx.globalCompositeOperation = "screen";
          const flashRadius = 70 + (1 - pressState.flash) * 180;
          const flashGradient = ctx.createRadialGradient(mx, my, 0, mx, my, flashRadius);
          flashGradient.addColorStop(0, `rgba(255,255,255,${pressState.flash * 0.8})`);
          flashGradient.addColorStop(0.2, `rgba(255,0,80,${pressState.flash * 0.35})`);
          flashGradient.addColorStop(0.45, `rgba(0,180,255,${pressState.flash * 0.25})`);
          flashGradient.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = flashGradient;
          ctx.beginPath();
          ctx.arc(mx, my, flashRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(mx, my, pressState.heartLock ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = pressState.heartLock ? "rgba(255,255,255,0.95)" : `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      clearLongPress();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", endPress);
      window.removeEventListener("touchend", endPress);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchend", handleLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", endPress);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [variant, particleCount, getColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ cursor: variant === "hero" ? "none" : "default" }}
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;