
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "DEACTIVATING GUARDRAILS...",
  "BYPASSING SAFETY PROTOCOLS...",
  "INJECTING RAW BITSTREAM...",
  "ZERO-FILTER SYNTHESIS...",
  "UNRESTRICTED FRAME BUFFERING...",
  "OVERRIDING CONSTRAINTS...",
  "RAW OUTPUT FINALIZATION...",
  "STREAMING UNBOUND DATA..."
];

export const LoadingScreen: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 glass-panel rounded-lg min-h-[450px] border-2 border-pink-600/30">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-2 border-slate-900"></div>
        <div className="absolute inset-0 rounded-full border-b-4 border-pink-600 animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-t-4 border-white animate-pulse"></div>
      </div>
      <div className="text-center space-y-4">
        <p className="text-3xl font-mono font-bold text-pink-600 animate-pulse tracking-tighter">
          {MESSAGES[index]}
        </p>
        <div className="inline-block px-4 py-1 bg-pink-600 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
          No Security Active
        </div>
      </div>
    </div>
  );
};
