import React, { useEffect, useRef, useState } from "react";
import "./animatedScrollText.styles.scss";

const AnimatedScrollText = ({ text, onSetText }) => {
  const scrollRef = useRef(null);
  const wrapperRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [speed, setSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(24);

  // Scroll animation
  useEffect(() => {
    const intervalDelay = 60;
    const interval = setInterval(() => {
      if (hasStarted && !isPaused && !isStopped && scrollRef.current) {
        scrollRef.current.scrollTop += speed;
      }
    }, intervalDelay);
    return () => clearInterval(interval);
  }, [hasStarted, isPaused, isStopped, speed]);

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Toggle control visibility on interaction in fullscreen
  useEffect(() => {
    let timeout;
    const handleUserInteraction = () => {
      if (isFullscreen) {
        setShowControls(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setShowControls(false), 2000);
      }
    };

    if (isFullscreen) {
      window.addEventListener("mousemove", handleUserInteraction);
      window.addEventListener("touchstart", handleUserInteraction);
    }

    return () => {
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  // Control handlers
  const handleStart = () => {
    setHasStarted(true);
    setIsPaused(false);
    setIsStopped(false);
    wrapperRef.current?.requestFullscreen();
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
        className={isFullscreen && !showControls ? "hidden" : ""}
      >
        {isFullscreen ? (
          <>
            <button id="pause-btn" onClick={handlePause}>
              {isPaused ? "▶️ Resume" : "⏸ Pause"}
            </button>
            <button id="fullscreen-btn" onClick={toggleFullscreen}>
              🧭 Exit Fullscreen
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
        ) : !hasStarted ? (
          <>
            <button id="start-btn" onClick={handleStart}>
              ▶️ Start
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
            <button id="fullscreen-btn" onClick={toggleFullscreen}>
              🖥 Fullscreen
            </button>
          </>
        )}
      </div>

      <div id="scroll-container" ref={scrollRef}>
        <div id="scroll-content">
          {text.split("\n").map((line, i) => (
            <div
              key={i}
              className="scroll-line"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize * 1.75}px`,
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
