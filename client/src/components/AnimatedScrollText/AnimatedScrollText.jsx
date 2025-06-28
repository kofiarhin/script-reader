import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollStep = 1;
    const intervalDelay = 30;

    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollTop += scrollStep;
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleRestart = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div>
      <div id="controls">
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          id="pause-btn"
          className="btn"
        >
          {isPaused ? "▶️ Resume" : "⏸ Pause"}
        </button>
        <button onClick={handleRestart} id="restart-btn" className="btn">
          🔄 Restart
        </button>
      </div>

      <div id="scroll-container" ref={scrollRef}>
        <div id="scroll-content">
          {text.split("\n").map((line, i) => (
            <div key={i} className="scroll-line">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedScrollText;
