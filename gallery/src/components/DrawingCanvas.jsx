import React, { useEffect, useRef, useState } from 'react';

function DrawingCanvas({ imageSrc, onSave }) {
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const bgCanvas = backgroundCanvasRef.current;
    const drawCanvas = drawingCanvasRef.current;
    const container = containerRef.current;
    const ctx = bgCanvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Get container dimensions
      const containerWidth = container.offsetWidth;
      const containerHeight = Math.floor(containerWidth * 0.75); // Aspect ratio 4:3

      // Set canvas sizes
      bgCanvas.width = containerWidth;
      bgCanvas.height = containerHeight;
      drawCanvas.width = containerWidth;
      drawCanvas.height = containerHeight;

      // Calculate scale preserving proportions
      const scaleRatio = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      );
      setScale(scaleRatio);

      // Calculate offsets for centering
      const offsetX = (containerWidth - img.width * scaleRatio) / 2;
      const offsetY = (containerHeight - img.height * scaleRatio) / 2;
      setOffset({ x: offsetX, y: offsetY });

      // Clear and draw the image
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        offsetX,
        offsetY,
        img.width * scaleRatio,
        img.height * scaleRatio
      );
    };

    img.src = imageSrc;
  }, [imageSrc]);

  // Get mouse/touch coordinates relative to drawing canvas
  const getCanvasPosition = (clientX, clientY) => {
    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return { x, y };
  };

  const startDrawing = (e) => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasPosition(
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY
    );

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : color;

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasPosition(
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY
    );

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx.beginPath();
  };

  // Merge drawing with original image at original resolution and call onSave with final data URL
  const handleSave = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const finalCanvas = document.createElement('canvas');

    const img = new Image();
    img.onload = () => {
      finalCanvas.width = img.width;
      finalCanvas.height = img.height;

      const ctx = finalCanvas.getContext('2d');

      // Draw the original image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Draw the drawing canvas scaled to original image size
      ctx.drawImage(
        drawingCanvas,
        offset.x,
        offset.y,
        img.width * scale,
        img.height * scale,
        0,
        0,
        img.width,
        img.height
      );

      const dataUrl = finalCanvas.toDataURL('image/png');
      onSave(dataUrl);
    };

    img.src = imageSrc;
  };

  // Clear drawing canvas only
  const resetDrawing = () => {
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
  };

  return (
    <div className="drawing-canvas" ref={containerRef} style={{ position: 'relative' }}>
      <canvas
        ref={backgroundCanvasRef}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      />
      <canvas
        ref={drawingCanvasRef}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="drawing-controls" style={{ marginTop: 'calc(75% * 1)' }}>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isEraser}
          />
        </label>
        <label>
          Brush size:
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(+e.target.value)}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={isEraser}
            onChange={() => setIsEraser(!isEraser)}
          />
          Eraser
        </label>
        <button onClick={resetDrawing}>Reset</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default DrawingCanvas;
