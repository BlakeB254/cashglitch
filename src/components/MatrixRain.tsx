"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters - mix of katakana, numbers, and symbols
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789$¥€£₿+-*/<>[]{}|\\~`!@#%^&()=;:,.?";
    const charArray = chars.split("");

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Purple/pink color palette
    const colors = [
      { r: 168, g: 85, b: 247 },  // Purple #a855f7
      { r: 236, g: 72, b: 153 },  // Pink #ec4899
      { r: 139, g: 92, b: 246 },  // Violet #8b5cf6
      { r: 196, g: 181, b: 253 }, // Lavender #c4b5fd
    ];

    // Drawing function
    const draw = () => {
      // Semi-transparent dark purple to create trail effect
      ctx.fillStyle = "rgba(15, 10, 26, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Calculate x position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Pick a random color from the palette
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.5 + 0.5;

        // Draw the character with purple/pink color
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fillText(char, x, y);

        // Brighter leading character (white/pink glow)
        if (Math.random() > 0.98) {
          ctx.fillStyle = "#f0abfc";
          ctx.fillText(char, x, y);
        }

        // Reset drop to top randomly after reaching bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5] opacity-70"
    />
  );
}
