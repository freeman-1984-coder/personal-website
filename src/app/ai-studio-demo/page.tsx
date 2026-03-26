"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AIStudioDemo() {
  const [epoch, setEpoch] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation Parameters
  const [learningRate, setLearningRate] = useState(0.01);
  const [complexity, setComplexity] = useState(50);

  // Handle animation loop
  useEffect(() => {
    if (!isPlaying) return;

    let animationId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (canvasRef.current) {
        setEpoch((prev) => prev + Math.floor(dt * 0.1 * learningRate * 100));
        drawNetwork(canvasRef.current, time);
      }
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, learningRate, complexity]);

  // Initial Draw
  useEffect(() => {
    if (canvasRef.current && !isPlaying) {
      drawNetwork(canvasRef.current, 0);
    }
  }, [complexity]);

  const drawNetwork = (canvas: HTMLCanvasElement, time: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Network Architecture: [Input, Hidden1, Hidden2, Output]
    const layers = [3, Math.floor(complexity / 10), Math.floor(complexity / 10), 2];
    const nodeRadius = 6;
    const nodes: { x: number; y: number; layer: number; active: boolean }[] = [];

    // Calculate positions
    const layerSpacing = w / (layers.length + 1);
    layers.forEach((nodeCount, layerIdx) => {
      const x = layerSpacing * (layerIdx + 1);
      const verticalSpacing = h / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        const y = verticalSpacing * (i + 1);
        const activeOffset = Math.sin(time * 0.002 + layerIdx + i) * 0.5 + 0.5;
        nodes.push({ x, y, layer: layerIdx, active: activeOffset > 0.4 });
      }
    });

    // Draw lines
    ctx.lineWidth = 1;
    nodes.forEach((nodeA) => {
      nodes.forEach((nodeB) => {
        if (nodeB.layer === nodeA.layer + 1) {
          // Dynamic pulsating gradient
          const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
          
          let opacity = 0.05;
          if (isPlaying && nodeA.active && nodeB.active) opacity = 0.4;
          
          gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`); // Violet
          gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`); // Blue
          
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();

          // Draw walking pulses 
          if (isPlaying && (nodeA.active || nodeB.active)) {
             const progress = (time * 0.001 * learningRate * 50 + (nodeA.y * 0.01)) % 1;
             const pX = nodeA.x + (nodeB.x - nodeA.x) * progress;
             const pY = nodeA.y + (nodeB.y - nodeA.y) * progress;
             
             ctx.fillStyle = "rgba(96, 165, 250, 0.8)"; // Light blue glow
             ctx.beginPath();
             ctx.arc(pX, pY, 2.5, 0, Math.PI * 2);
             ctx.fill();
          }
        }
      });
    });

    // Draw Nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      
      if (node.active && isPlaying) {
        ctx.fillStyle = "#A78BFA"; // Active violet
        ctx.shadowColor = "#8B5CF6";
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = "#1E293B"; // Slate dark
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#38BDF8"; // Sky border
      ctx.stroke();
    });
    ctx.shadowBlur = 0; // reset
  };

  return (
    <div className="aistudio-container">
      <style>{`
        .aistudio-container {
          min-height: 100vh;
          background-color: #030712;
          background-image: radial-gradient(circle at 15% 50%, rgba(30, 58, 138, 0.15), transparent 25%),
                            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%);
          color: #F8FAFC;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          overflow: hidden;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #38BDF8 0%, #A78BFA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 10px 0;
        }

        .subtitle {
          color: #94A3B8;
          font-size: 1.1rem;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .workspace {
          display: flex;
          gap: 24px;
          width: 100%;
          max-width: 1200px;
          height: 60vh;
          min-height: 400px;
        }

        .canvas-container {
          flex: 1;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          position: relative;
          backdrop-filter: blur(12px);
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .network-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .overlay-badge {
          position: absolute;
          top: 20px;
          left: 20px;
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
        }

        .recording-dot {
          width: 8px;
          height: 8px;
          background-color: #EF4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .control-panel {
          width: 320px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 12px;
          margin: 0;
          color: #F8FAFC;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-label {
          font-size: 0.85rem;
          color: #94A3B8;
          display: flex;
          justify-content: space-between;
        }

        .range-slider {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }

        .range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .range-slider::-webkit-slider-thumb {
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
        
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .action-button {
          background: linear-gradient(135deg, #6366F1 0%, #a14bf2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
        
        .action-button.stop {
          background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.39);
        }

        .stats-box {
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-line {
          display: flex;
          justify-content: space-between;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.85rem;
          color: #38BDF8;
        }
      `}</style>

      <div className="header">
        <h1 className="title">AI Studio Interactive</h1>
        <p className="subtitle">
          Watch how this neural network converges in real-time. No static videos, just pure math and code running natively in your browser. Feel the gravity.
        </p>
      </div>

      <div className="workspace">
        <div className="canvas-container">
          <div className="overlay-badge">
            {isPlaying && <div className="recording-dot"></div>}
            {isPlaying ? "LIVE TRAINING" : "STANDBY MODE"}
          </div>
          <canvas ref={canvasRef} className="network-canvas" />
        </div>

        <div className="control-panel">
          <h2 className="panel-title">Model Parameters</h2>

          <div className="control-group">
            <div className="control-label">
              <span>Learning Rate (α)</span>
              <span>{learningRate.toFixed(3)}</span>
            </div>
            <input 
              type="range" 
              className="range-slider"
              min="0.001" 
              max="0.05" 
              step="0.001" 
              value={learningRate} 
              onChange={(e) => setLearningRate(parseFloat(e.target.value))} 
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Network Complexity</span>
              <span>{complexity} hidden dims</span>
            </div>
            <input 
              type="range" 
              className="range-slider"
              min="20" 
              max="150" 
              step="10" 
              value={complexity} 
              onChange={(e) => setComplexity(parseInt(e.target.value))} 
            />
          </div>

          <div className="stats-box">
            <div className="stat-line">
              <span>Epoch:</span>
              <span>{epoch.toLocaleString()}</span>
            </div>
            <div className="stat-line">
              <span>Loss (MSE):</span>
              <span>{(Math.max(0.01, 1 - epoch / 100000)).toFixed(5)}</span>
            </div>
          </div>

          <button 
            className={`action-button ${isPlaying ? 'stop' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "Halt Training" : "Initialize Training Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
