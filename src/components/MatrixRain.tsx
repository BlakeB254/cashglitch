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

    // Binary code - just 0s and 1s
    const chars = "01";
    const charArray = chars.split("");

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Purple/pink color palette - more vibrant
    const colors = [
      { r: 192, g: 132, b: 252 }, // Bright purple #c084fc
      { r: 244, g: 114, b: 182 }, // Bright pink #f472b6
      { r: 167, g: 139, b: 250 }, // Violet #a78bfa
      { r: 232, g: 121, b: 249 }, // Fuchsia #e879f9
      { r: 217, g: 70, b: 239 },  // Magenta #d946ef
    ];

    // Assign a consistent color to each column for better visual effect
    const columnColors = drops.map(() => colors[Math.floor(Math.random() * colors.length)]);

    // Drawing function
    const draw = () => {
      // Semi-transparent dark purple to create trail effect
      ctx.fillStyle = "rgba(15, 10, 26, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Calculate x position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Use the column's assigned color with varying alpha
        const color = columnColors[i];
        const alpha = Math.random() * 0.4 + 0.6;

        // Draw the character with purple/pink color
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fillText(char, x, y);

        // Brighter leading character (white/pink glow) - more frequent
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#fdf4ff";
          ctx.fillText(char, x, y);
        }

        // Reset drop to top randomly after reaching bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          // Assign new random color when column resets
          columnColors[i] = colors[Math.floor(Math.random() * colors.length)];
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
