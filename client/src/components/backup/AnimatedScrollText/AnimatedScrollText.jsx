import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text }) => {
  const containerRef = useRef(null);
  const lines = text.split("\n");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = Math.min(prev + 1, lines.length - 1);
        const lineEl = containerRef.current?.children[next];
        if (lineEl) {
          lineEl.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return next;
      });
    }, 2500); // 2.5s per line scroll
    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div id="scroll-container" ref={containerRef}>
      {lines.map((line, i) => (
        <div
          key={i}
          className={`scroll-line ${i === activeIndex ? "active" : ""}`}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

export default AnimatedScrollText;
