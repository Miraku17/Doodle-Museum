import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, Trash2, Save, Wand2, RotateCcw, RotateCw } from 'lucide-react';
import { DoodleButton } from './UI';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  onAnalyzeRequest: (dataUrl: string) => Promise<void>;
  isAnalyzing: boolean;
}

const CANVAS_SIZE = 320;
const COLORS = [
  '#2d2d2d', // Charcoal
  '#dc2626', // Red
  '#ea580c', // Orange
  '#ca8a04', // Dark Yellow
  '#16a34a', // Green
  '#2563eb', // Blue
  '#9333ea', // Purple
  '#db2777', // Pink
  '#57534e', // Stone
];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, onAnalyzeRequest, isAnalyzing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  // History State
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save initial blank state
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setHistory([imageData]);
    setHistoryStep(0);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); 
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    draw(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.beginPath(); // Reset path
        
        // Save State
        const imageData = ctx?.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (imageData) {
            const newHistory = history.slice(0, historyStep + 1);
            newHistory.push(imageData);
            setHistory(newHistory);
            setHistoryStep(newHistory.length - 1);
        }
    }
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = tool === 'pencil' ? 3 : 20;
    ctx.strokeStyle = tool === 'pencil' ? selectedColor : '#ffffff';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    draw(x, y);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
        const newStep = historyStep - 1;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && history[newStep]) {
            ctx.putImageData(history[newStep], 0, 0);
            setHistoryStep(newStep);
        }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
        const newStep = historyStep + 1;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && history[newStep]) {
            ctx.putImageData(history[newStep], 0, 0);
            setHistoryStep(newStep);
        }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Save state after clear
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleColorSelect = (color: string) => {
      setSelectedColor(color);
      setTool('pencil');
  };

  const handleSave = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleAnalyze = () => {
    if (canvasRef.current) {
        onAnalyzeRequest(canvasRef.current.toDataURL('image/png'));
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      
      {/* Tools Row */}
      <div className="flex flex-wrap justify-center items-center gap-3 bg-white p-3 border-2 border-black rounded-xl shadow-lg max-w-[340px]">
        {/* Drawing Tools */}
        <div className="flex gap-2 items-center border-r-2 border-stone-200 pr-3">
            <button 
            onClick={() => setTool('pencil')}
            className={`p-2 rounded-lg transition-colors ${tool === 'pencil' ? 'bg-stone-200 text-black' : 'text-stone-400 hover:text-black'}`}
            title="Pencil"
            >
            <Pencil size={20} />
            </button>
            <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-stone-200 text-black' : 'text-stone-400 hover:text-black'}`}
            title="Eraser"
            >
            <Eraser size={20} />
            </button>
        </div>

        {/* History Tools */}
        <div className="flex gap-2 items-center border-r-2 border-stone-200 pr-3">
            <button 
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo"
            >
            <RotateCcw size={20} />
            </button>
            <button 
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo"
            >
            <RotateCw size={20} />
            </button>
        </div>

        {/* Clear */}
        <button 
          onClick={clearCanvas}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Color Palette */}
      <div className="flex flex-wrap justify-center gap-3 max-w-[320px]">
        {COLORS.map((color) => (
            <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 ${selectedColor === color && tool === 'pencil' ? 'ring-2 ring-stone-800 scale-110' : ''}`}
                style={{ backgroundColor: color }}
                title={color}
            />
        ))}
      </div>

      {/* Canvas Area */}
      <div className="relative p-2 bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transform rotate-1">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={handleMouseMove}
          onTouchEnd={stopDrawing}
          className={`touch-none ${tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
        />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-200 px-3 py-1 font-doodle text-sm shadow-sm rotate-[-2deg]">
            Draw Here!
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full justify-center max-w-[320px]">
        <DoodleButton 
            variant="secondary" 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="flex items-center gap-2 flex-1 justify-center"
        >
          <Wand2 size={18} />
          {isAnalyzing ? 'Thinking...' : 'AI Name'}
        </DoodleButton>

        <DoodleButton 
            variant="primary" 
            onClick={handleSave}
            className="flex items-center gap-2 flex-1 justify-center"
        >
          <Save size={18} />
          Save Art
        </DoodleButton>
      </div>

    </div>
  );
};