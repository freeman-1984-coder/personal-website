"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// --- Game Logic Helpers ---

function countNeighbors(
  grid: Uint8Array,
  r: number,
  c: number,
  rows: number,
  cols: number
): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = (r + dr + rows) % rows;
      const nc = (c + dc + cols) % cols;
      count += grid[nr * cols + nc];
    }
  }
  return count;
}

function stepGrid(
  current: Uint8Array,
  next: Uint8Array,
  rows: number,
  cols: number
): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const neighbors = countNeighbors(current, r, c, rows, cols);
      const alive = current[idx];
      next[idx] =
        (alive && (neighbors === 2 || neighbors === 3)) ||
        (!alive && neighbors === 3)
          ? 1
          : 0;
    }
  }
}

function randomizeGrid(grid: Uint8Array, density = 0.3): void {
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < density ? 1 : 0;
  }
}

// --- Component ---

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridARef = useRef<Uint8Array | null>(null);
  const gridBRef = useRef<Uint8Array | null>(null);
  const currentGridRef = useRef<"A" | "B">("A");
  const dimsRef = useRef({ rows: 0, cols: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [aliveCount, setAliveCount] = useState(0);
  const [speed, setSpeed] = useState(100);
  const [cellSize, setCellSize] = useState(10);
  const [gridDims, setGridDims] = useState({ rows: 0, cols: 0 });

  const isDrawingRef = useRef(false);
  const drawValueRef = useRef<0 | 1>(1);
  const lastDrawnCellRef = useRef<{ r: number; c: number } | null>(null);

  const getGrid = useCallback(() => {
    return currentGridRef.current === "A"
      ? gridARef.current
      : gridBRef.current;
  }, []);

  const getNextGrid = useCallback(() => {
    return currentGridRef.current === "A"
      ? gridBRef.current
      : gridARef.current;
  }, []);

  const countAlive = useCallback((grid: Uint8Array) => {
    let count = 0;
    for (let i = 0; i < grid.length; i++) count += grid[i];
    return count;
  }, []);

  // --- Draw the grid onto canvas ---
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const grid = getGrid();
    if (!canvas || !grid) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (
      canvas.width !== Math.floor(w * dpr) ||
      canvas.height !== Math.floor(h * dpr)
    ) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { rows, cols } = dimsRef.current;

    // Background
    ctx.fillStyle = "#0B1120";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(139, 92, 246, 0.06)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= cols; c++) {
      const x = c * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rows * cellSize);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      const y = r * cellSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cols * cellSize, y);
      ctx.stroke();
    }

    // Alive cells
    const useGlow = cellSize > 6;
    if (useGlow) {
      ctx.shadowColor = "#8B5CF6";
      ctx.shadowBlur = 4;
    }
    ctx.fillStyle = "#A78BFA";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r * cols + c]) {
          ctx.fillRect(
            c * cellSize + 1,
            r * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
        }
      }
    }
    ctx.shadowBlur = 0;
  }, [cellSize, getGrid]);

  // --- Initialize / resize grid ---
  const initGrid = useCallback(
    (keepContent = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const cols = Math.floor(rect.width / cellSize);
      const rows = Math.floor(rect.height / cellSize);
      const size = rows * cols;

      const oldGrid = getGrid();
      const oldDims = dimsRef.current;

      dimsRef.current = { rows, cols };
      setGridDims({ rows, cols });

      const newA = new Uint8Array(size);
      const newB = new Uint8Array(size);

      if (keepContent && oldGrid && oldDims.rows > 0) {
        const minRows = Math.min(rows, oldDims.rows);
        const minCols = Math.min(cols, oldDims.cols);
        for (let r = 0; r < minRows; r++) {
          for (let c = 0; c < minCols; c++) {
            newA[r * cols + c] = oldGrid[r * oldDims.cols + c];
          }
        }
      }

      gridARef.current = newA;
      gridBRef.current = newB;
      currentGridRef.current = "A";

      setAliveCount(countAlive(newA));
      drawGrid();
    },
    [cellSize, getGrid, countAlive, drawGrid]
  );

  // --- Mount + resize ---
  useEffect(() => {
    initGrid(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      initGrid(true);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [cellSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Redraw when grid changes externally ---
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // --- Animation loop ---
  useEffect(() => {
    if (!isPlaying) return;

    let animationId: number;
    let lastStepTime = performance.now();

    const loop = (time: number) => {
      if (time - lastStepTime >= speed) {
        const grid = getGrid();
        const next = getNextGrid();
        if (grid && next) {
          const { rows, cols } = dimsRef.current;
          stepGrid(grid, next, rows, cols);
          currentGridRef.current =
            currentGridRef.current === "A" ? "B" : "A";
          setGeneration((g) => g + 1);
          setAliveCount(countAlive(next));
          drawGrid();
        }
        lastStepTime = time;
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, speed, getGrid, getNextGrid, countAlive, drawGrid]);

  // --- Actions ---
  const handleStep = () => {
    const grid = getGrid();
    const next = getNextGrid();
    if (!grid || !next) return;
    const { rows, cols } = dimsRef.current;
    stepGrid(grid, next, rows, cols);
    currentGridRef.current = currentGridRef.current === "A" ? "B" : "A";
    setGeneration((g) => g + 1);
    setAliveCount(countAlive(next));
    drawGrid();
  };

  const handleRandom = () => {
    const grid = getGrid();
    if (!grid) return;
    randomizeGrid(grid);
    setGeneration(0);
    setAliveCount(countAlive(grid));
    drawGrid();
  };

  const handleClear = () => {
    const grid = getGrid();
    if (!grid) return;
    grid.fill(0);
    setGeneration(0);
    setAliveCount(0);
    setIsPlaying(false);
    drawGrid();
  };

  // --- Mouse / Touch drawing ---
  const getCellFromEvent = (
    e: { clientX: number; clientY: number }
  ): { r: number; c: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);
    const { rows, cols } = dimsRef.current;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  };

  const toggleCell = (r: number, c: number) => {
    const grid = getGrid();
    if (!grid) return;
    const { cols } = dimsRef.current;
    const idx = r * cols + c;
    grid[idx] = drawValueRef.current;
    setAliveCount(countAlive(grid));
    drawGrid();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const cell = getCellFromEvent(e);
    if (!cell) return;
    const grid = getGrid();
    if (!grid) return;
    const { cols } = dimsRef.current;
    const idx = cell.r * cols + cell.c;
    drawValueRef.current = grid[idx] ? 0 : 1;
    isDrawingRef.current = true;
    lastDrawnCellRef.current = cell;
    toggleCell(cell.r, cell.c);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const cell = getCellFromEvent(e);
    if (!cell) return;
    if (
      lastDrawnCellRef.current &&
      lastDrawnCellRef.current.r === cell.r &&
      lastDrawnCellRef.current.c === cell.c
    )
      return;
    lastDrawnCellRef.current = cell;
    toggleCell(cell.r, cell.c);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastDrawnCellRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = getCellFromEvent(touch);
    if (!cell) return;
    const grid = getGrid();
    if (!grid) return;
    const { cols } = dimsRef.current;
    const idx = cell.r * cols + cell.c;
    drawValueRef.current = grid[idx] ? 0 : 1;
    isDrawingRef.current = true;
    lastDrawnCellRef.current = cell;
    toggleCell(cell.r, cell.c);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    const cell = getCellFromEvent(touch);
    if (!cell) return;
    if (
      lastDrawnCellRef.current &&
      lastDrawnCellRef.current.r === cell.r &&
      lastDrawnCellRef.current.c === cell.c
    )
      return;
    lastDrawnCellRef.current = cell;
    toggleCell(cell.r, cell.c);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastDrawnCellRef.current = null;
  };

  return (
    <div className="gol-container">
      <style>{`
        .gol-container {
          min-height: 100vh;
          background-color: #030712;
          background-image: radial-gradient(circle at 15% 50%, rgba(30, 58, 138, 0.15), transparent 25%),
                            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%);
          color: #F8FAFC;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 120px 20px 40px;
          overflow: hidden;
        }

        .gol-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .gol-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #38BDF8 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
        }

        .gol-subtitle {
          color: #94A3B8;
          font-size: 1.05rem;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .gol-workspace {
          display: flex;
          gap: 24px;
          width: 100%;
          max-width: 1200px;
          height: 65vh;
          min-height: 400px;
        }

        .gol-canvas-container {
          flex: 1;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          position: relative;
          backdrop-filter: blur(12px);
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          cursor: crosshair;
        }

        .gol-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .gol-overlay-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(2, 6, 23, 0.8);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #38BDF8;
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          user-select: none;
          z-index: 2;
        }

        .gol-recording-dot {
          width: 8px;
          height: 8px;
          background-color: #22C55E;
          border-radius: 50%;
          animation: gol-pulse 1.5s infinite;
        }

        @keyframes gol-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .gol-control-panel {
          width: 300px;
          flex-shrink: 0;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow-y: auto;
        }

        .gol-panel-title {
          font-size: 1.15rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
          margin: 0;
          color: #F8FAFC;
        }

        .gol-control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gol-control-label {
          font-size: 0.85rem;
          color: #94A3B8;
          display: flex;
          justify-content: space-between;
        }

        .gol-range-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }

        .gol-range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .gol-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #A78BFA;
          cursor: pointer;
          margin-top: -5px;
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
          transition: transform 0.1s;
        }

        .gol-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .gol-stats-box {
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .gol-stat-line {
          display: flex;
          justify-content: space-between;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.82rem;
          color: #38BDF8;
        }

        .gol-action-button {
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.35);
        }

        .gol-action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
        }

        .gol-action-button.stop {
          background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.35);
        }

        .gol-action-button.stop:hover {
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }

        .gol-btn-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .gol-secondary-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #A78BFA;
          padding: 10px 8px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gol-secondary-btn:hover {
          background: rgba(167, 139, 250, 0.1);
          border-color: rgba(167, 139, 250, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .gol-workspace {
            flex-direction: column;
            height: auto;
          }
          .gol-canvas-container {
            height: 50vh;
            min-height: 300px;
          }
          .gol-control-panel {
            width: 100%;
          }
          .gol-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="gol-header">
        <h1 className="gol-title">Conway&apos;s Game of Life</h1>
        <p className="gol-subtitle">
          Click to draw cells, then hit play to watch them evolve.
          Simple rules, emergent complexity.
        </p>
      </div>

      <div className="gol-workspace">
        <div className="gol-canvas-container">
          <div className="gol-overlay-badge">
            {isPlaying && <div className="gol-recording-dot" />}
            GEN {generation.toLocaleString()} &mdash;{" "}
            {isPlaying ? "RUNNING" : "PAUSED"}
          </div>
          <canvas
            ref={canvasRef}
            className="gol-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="gol-control-panel">
          <h2 className="gol-panel-title">Simulation Controls</h2>

          <div className="gol-control-group">
            <div className="gol-control-label">
              <span>Speed</span>
              <span>{speed}ms / gen</span>
            </div>
            <input
              type="range"
              className="gol-range-slider"
              min="10"
              max="500"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
          </div>

          <div className="gol-control-group">
            <div className="gol-control-label">
              <span>Cell Size</span>
              <span>{cellSize}px</span>
            </div>
            <input
              type="range"
              className="gol-range-slider"
              min="4"
              max="20"
              step="1"
              value={cellSize}
              onChange={(e) => setCellSize(parseInt(e.target.value))}
            />
          </div>

          <div className="gol-stats-box">
            <div className="gol-stat-line">
              <span>Generation:</span>
              <span>{generation.toLocaleString()}</span>
            </div>
            <div className="gol-stat-line">
              <span>Alive:</span>
              <span>{aliveCount.toLocaleString()}</span>
            </div>
            <div className="gol-stat-line">
              <span>Grid:</span>
              <span>
                {gridDims.cols} &times; {gridDims.rows}
              </span>
            </div>
          </div>

          <button
            className={`gol-action-button ${isPlaying ? "stop" : ""}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="gol-btn-row">
            <button className="gol-secondary-btn" onClick={handleStep}>
              Step
            </button>
            <button className="gol-secondary-btn" onClick={handleRandom}>
              Random
            </button>
            <button className="gol-secondary-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
