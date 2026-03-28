"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// --- Presets Data ---
const PRESETS: { name: string; data: number[][] }[] = [
  {
    name: "Glider",
    data: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    name: "Blinker",
    data: [[1, 1, 1]],
  },
  {
    name: "Pulsar",
    data: [
      "0011100011100",
      "0000000000000",
      "1000010100001",
      "1000010100001",
      "1000010100001",
      "0011100011100",
      "0000000000000",
      "0011100011100",
      "1000010100001",
      "1000010100001",
      "1000010100001",
      "0000000000000",
      "0011100011100",
    ].map((r) => r.split("").map(Number)),
  },
  {
    name: "Gosper Glider Gun",
    data: [
      "000000000000000000000000100000000000",
      "000000000000000000000010100000000000",
      "000000000000110000001100000000000011",
      "000000000001000100001100000000000011",
      "110000000010000010001100000000000000",
      "110000000010001011000010100000000000",
      "000000000010000010000000100000000000",
      "000000000001000100000000000000000000",
      "000000000000110000000000000000000000",
    ].map((r) => r.split("").map(Number)),
  },
];

// --- Game Logic Helpers ---

// Bresenham's line algorithm for smooth drawing
function getBresenhamLine(r0: number, c0: number, r1: number, c1: number) {
  const points = [];
  const dr = Math.abs(r1 - r0);
  const dc = Math.abs(c1 - c0);
  const sr = r0 < r1 ? 1 : -1;
  const sc = c0 < c1 ? 1 : -1;
  let err = (dc > dr ? dc : -dr) / 2;

  let r = r0;
  let c = c0;

  while (true) {
    points.push({ r, c });
    if (r === r1 && c === c1) break;
    const e2 = err;
    if (e2 > -dc) {
      err -= dr;
      c += sc;
    }
    if (e2 < dr) {
      err += dc;
      r += sr;
    }
  }
  return points;
}

// Optimized Grid Stepping
function stepGrid(
  current: Uint8Array,
  next: Uint8Array,
  rows: number,
  cols: number
): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      let count = 0;

      // Fast path for inner cells to entirely avoid expensive modulo math
      if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
        const up = (r - 1) * cols;
        const down = (r + 1) * cols;
        count =
          current[up + c - 1] +
          current[up + c] +
          current[up + c + 1] +
          current[idx - 1] +
          current[idx + 1] +
          current[down + c - 1] +
          current[down + c] +
          current[down + c + 1];
      } else {
        // Slow path bounds wrapped for edges
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + rows) % rows;
            const nc = (c + dc + cols) % cols;
            count += current[nr * cols + nc];
          }
        }
      }

      const alive = current[idx];
      next[idx] =
        (alive && (count === 2 || count === 3)) || (!alive && count === 3)
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
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null); // Grid cache

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
  const [drawMode, setDrawMode] = useState<"pen" | "eraser">("pen");

  const isDrawingRef = useRef(false);
  const drawValueRef = useRef<0 | 1>(1);
  const lastDrawnCellRef = useRef<{ r: number; c: number } | null>(null);

  const getGrid = useCallback(() => {
    return currentGridRef.current === "A" ? gridARef.current : gridBRef.current;
  }, []);

  const getNextGrid = useCallback(() => {
    return currentGridRef.current === "A" ? gridBRef.current : gridARef.current;
  }, []);

  const countAlive = useCallback((grid: Uint8Array) => {
    let count = 0;
    for (let i = 0; i < grid.length; i++) count += grid[i];
    return count;
  }, []);

  // --- Offscreen Background Cache ---
  const updateBackgroundCache = useCallback(
    (rows: number, cols: number, size: number) => {
      if (!bgCanvasRef.current) {
        bgCanvasRef.current = document.createElement("canvas");
      }
      const bgCanvas = bgCanvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const w = cols * size;
      const h = rows * size;

      bgCanvas.width = Math.floor(w * dpr);
      bgCanvas.height = Math.floor(h * dpr);

      const ctx = bgCanvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background
      ctx.fillStyle = "#0B1120";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(139, 92, 246, 0.06)";
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * size;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * size;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    },
    []
  );

  // --- Draw the grid onto main canvas ---
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

    // Fast copy from cached background canvas
    if (bgCanvasRef.current) {
      // Due to DPR set on context, we give logical width/height to drawImage
      ctx.drawImage(bgCanvasRef.current, 0, 0, cols * cellSize, rows * cellSize);
    } else {
      ctx.fillStyle = "#0B1120";
      ctx.fillRect(0, 0, w, h);
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
      updateBackgroundCache(rows, cols, cellSize);

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
    [cellSize, getGrid, countAlive, drawGrid, updateBackgroundCache]
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
          currentGridRef.current = currentGridRef.current === "A" ? "B" : "A";
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

  const placePreset = (presetData: number[][]) => {
    setIsPlaying(false);
    const grid = getGrid();
    if (!grid) return;
    grid.fill(0);

    const { rows, cols } = dimsRef.current;
    const pRows = presetData.length;
    const pCols = presetData[0].length;

    // Center preset
    const startR = Math.max(0, Math.floor((rows - pRows) / 2));
    const startC = Math.max(0, Math.floor((cols - pCols) / 2));

    for (let r = 0; r < pRows; r++) {
      for (let c = 0; c < pCols; c++) {
        const gr = startR + r;
        const gc = startC + c;
        if (gr < rows && gc < cols) {
          grid[gr * cols + gc] = presetData[r][c];
        }
      }
    }

    setGeneration(0);
    setAliveCount(countAlive(grid));
    drawGrid();
  };

  // --- Mouse / Touch drawing ---
  const getCellFromEvent = (e: {
    clientX: number;
    clientY: number;
  }): { r: number; c: number } | null => {
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

  const paintLine = (
    r0: number,
    c0: number,
    r1: number,
    c1: number,
    val: 0 | 1
  ) => {
    const grid = getGrid();
    if (!grid) return;
    const { cols } = dimsRef.current;
    const points = getBresenhamLine(r0, c0, r1, c1);
    for (const p of points) {
      grid[p.r * cols + p.c] = val;
    }
    setAliveCount(countAlive(grid));
    drawGrid();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const cell = getCellFromEvent(e);
    if (!cell) return;
    if (drawMode === "pen") {
      drawValueRef.current = 1;
    } else {
      drawValueRef.current = 0;
    }
    isDrawingRef.current = true;
    lastDrawnCellRef.current = cell;
    paintLine(cell.r, cell.c, cell.r, cell.c, drawValueRef.current);
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

    if (lastDrawnCellRef.current) {
      paintLine(
        lastDrawnCellRef.current.r,
        lastDrawnCellRef.current.c,
        cell.r,
        cell.c,
        drawValueRef.current
      );
    }
    lastDrawnCellRef.current = cell;
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastDrawnCellRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Single touch drawing only, prevent scrolling while drawing
    if (e.touches.length === 1) e.preventDefault();
    const touch = e.touches[0];
    const cell = getCellFromEvent(touch);
    if (!cell) return;

    drawValueRef.current = drawMode === "pen" ? 1 : 0;
    isDrawingRef.current = true;
    lastDrawnCellRef.current = cell;
    paintLine(cell.r, cell.c, cell.r, cell.c, drawValueRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) e.preventDefault();
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

    if (lastDrawnCellRef.current) {
      paintLine(
        lastDrawnCellRef.current.r,
        lastDrawnCellRef.current.c,
        cell.r,
        cell.c,
        drawValueRef.current
      );
    }
    lastDrawnCellRef.current = cell;
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
          padding: 80px 20px 40px;
          overflow: hidden;
        }

        .gol-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .gol-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #38BDF8 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
        }

        .gol-subtitle {
          color: #94A3B8;
          font-size: 1rem;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .gol-workspace {
          display: flex;
          gap: 20px;
          width: 100%;
          max-width: 1200px;
          height: 70vh;
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
          touch-action: none;
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
          width: 320px;
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
          font-size: 1.1rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
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

        .gol-tool-toggle {
          display: flex;
          background: rgba(0,0,0,0.4);
          border-radius: 10px;
          overflow: hidden;
          padding: 4px;
        }

        .gol-tool-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: #94A3B8;
          padding: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .gol-tool-btn.active {
          background: #38BDF8;
          color: #0F172A;
          box-shadow: 0 2px 10px rgba(56, 189, 248, 0.3);
        }

        .gol-tool-btn.eraser.active {
          background: #EF4444;
          color: #FFF;
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
        }

        .gol-preset-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
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

        .gol-secondary-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #A78BFA;
          padding: 8px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .gol-secondary-btn:hover {
          background: rgba(167, 139, 250, 0.1);
          border-color: rgba(167, 139, 250, 0.3);
          transform: translateY(-1px);
        }
        
        .gol-btn-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
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
          Click and drag to draw patterns, load presets, and watch complexity emerge.
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
          <h2 className="gol-panel-title">Controls</h2>

          <div className="gol-control-group">
            <div className="gol-tool-toggle">
              <button
                className={`gol-tool-btn ${drawMode === "pen" ? "active" : ""}`}
                onClick={() => setDrawMode("pen")}
              >
                Pen
              </button>
              <button
                className={`gol-tool-btn eraser ${
                  drawMode === "eraser" ? "active" : ""
                }`}
                onClick={() => setDrawMode("eraser")}
              >
                Eraser
              </button>
            </div>
          </div>

          <div className="gol-control-group">
            <div className="gol-control-label">
              <span>Presets</span>
            </div>
            <div className="gol-preset-grid">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  className="gol-secondary-btn"
                  onClick={() => placePreset(p.data)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="gol-control-group" style={{ marginTop: "4px" }}>
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
              <span>Alive Cells:</span>
              <span>{aliveCount.toLocaleString()}</span>
            </div>
            <div className="gol-stat-line">
              <span>Grid Size:</span>
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
              Randomize
            </button>
            <button className="gol-secondary-btn" style={{color:"#F87171"}} onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
