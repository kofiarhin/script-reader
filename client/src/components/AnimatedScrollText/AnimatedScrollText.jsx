import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1); // scroll step

  useEffect(() => {
    const intervalDelay = 30;

    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollTop += speed;
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [isPaused, speed]);

  const handleRestart = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div>
      <div id="controls">
        <button onClick={() => setIsPaused((prev) => !prev)} id="pause-btn">
          {isPaused ? "▶️ Resume" : "⏸ Pause"}
        </button>

        <div id="speed-control">
          <label htmlFor="speed">Speed: {speed}</label>
          <input
            type="range"
            id="speed"
            min="1"
            max="10"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handleRestart} id="restart-btn">
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
