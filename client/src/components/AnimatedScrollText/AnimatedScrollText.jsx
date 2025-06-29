import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text, onSetText }) => {
  const scrollRef = useRef(null);
  const wrapperRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(24); // in px
  const [speed, setSpeed] = useState(1); // scroll step
  const [showControls, setShowControls] = useState(true);

  // Auto-scroll interval
  useEffect(() => {
    const intervalDelay = 60;
    const interval = setInterval(() => {
      if (hasStarted && !isPaused && !isStopped && scrollRef.current) {
        scrollRef.current.scrollTop += speed;
      }
    }, intervalDelay);
    return () => clearInterval(interval);
  }, [hasStarted, isPaused, isStopped, speed]);

  // Fullscreen change tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Show/hide controls in fullscreen on user interaction
  useEffect(() => {
    let timeout;
    const showTemporarily = () => {
      if (!isFullscreen) return;
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 2000);
    };

    if (isFullscreen) {
      window.addEventListener("mousemove", showTemporarily);
      window.addEventListener("click", showTemporarily);
      showTemporarily();
    }

    return () => {
      window.removeEventListener("mousemove", showTemporarily);
      window.removeEventListener("click", showTemporarily);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  const handleStart = () => {
    setHasStarted(true);
    setIsPaused(false);
    setIsStopped(false);
    if (!document.fullscreenElement && wrapperRef.current) {
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
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
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
      <div
        id="controls"
        className={isFullscreen && !showControls ? "" : "showing"}
      >
        {!hasStarted ? (
          <div className="start-wrapper">
            <button id="start-btn" onClick={handleStart}>
              ▶️ Start
            </button>
          </div>
        ) : (
          <>
            <button id="pause-btn" onClick={handlePause}>
              {isPaused ? "▶️ Resume" : "⏸ Pause"}
            </button>
            <button id="stop-btn" onClick={handleStop}>
              ⏹ Stop
            </button>
            <button id="restart-btn" onClick={handleRestart}>
              🔄 Restart
            </button>
          </>
        )}

        {(!hasStarted || isFullscreen) && (
          <>
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

            <div id="font-size-control">
              <label htmlFor="font-size">Font Size: {fontSize}px</label>
              <input
                type="range"
                id="font-size"
                min="16"
                max="48"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
              />
            </div>
          </>
        )}

        <button id="fullscreen-btn" onClick={toggleFullscreen}>
          {isFullscreen ? "🧭 Exit Fullscreen" : "🖥 Fullscreen"}
        </button>
      </div>

      <div id="scroll-container" ref={scrollRef}>
        <div id="scroll-content">
          {text.split("\n").map((line, index) => (
            <div
              key={index}
              className="scroll-line"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize * 1.6}px`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedScrollText;
