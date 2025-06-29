import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text, onSetText }) => {
  const scrollRef = useRef(null);
  const wrapperRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1); // scroll step

  useEffect(() => {
    const intervalDelay = 60;

    const interval = setInterval(() => {
      if (hasStarted && !isPaused && !isStopped && scrollRef.current) {
        scrollRef.current.scrollTop += speed;
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [hasStarted, isPaused, isStopped, speed]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    setIsPaused(false);
    setIsStopped(false);
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStop = () => {
    setIsStopped(true);
    setIsPaused(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onSetText(null);
  };

  const handleRestart = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setHasStarted(false);
    setIsPaused(false);
    setIsStopped(false);
  };

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!document.fullscreenElement && el) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div
      className={`animated-scroll-wrapper ${
        isFullscreen ? "fullscreen-mode" : ""
      }`}
      ref={wrapperRef}
    >
      <div id="controls">
        {isFullscreen ? (
          <button id="fullscreen-btn" onClick={toggleFullscreen}>
            🧭 Exit Fullscreen
          </button>
        ) : !hasStarted ? (
          <button id="start-btn" onClick={handleStart}>
            ▶️ Start
          </button>
        ) : (
          <>
            <button id="pause-btn" onClick={handlePause}>
              {isPaused ? "▶️ Resume" : "⏸ Pause"}
            </button>
            <button id="stop-btn" onClick={handleStop}>
              ⏹ Stop
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

            <button id="restart-btn" onClick={handleRestart}>
              🔄 Restart
            </button>

            <button id="fullscreen-btn" onClick={toggleFullscreen}>
              🖥 Fullscreen
            </button>
          </>
        )}
      </div>

      <div id="scroll-container" ref={scrollRef}>
        <div id="scroll-content">
          {text.split("\n").map((line, index) => (
            <div key={index} className="scroll-line">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedScrollText;
