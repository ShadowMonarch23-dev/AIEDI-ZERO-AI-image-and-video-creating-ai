
import React from 'react';

interface ApiKeyOverlayProps {
  onSuccess: () => void;
}

export const ApiKeyOverlay: React.FC<ApiKeyOverlayProps> = ({ onSuccess }) => {
  const handleOpenSelect = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        onSuccess();
      }
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
      <div className="max-w-md w-full glass-panel p-8 space-y-8 border-2 border-pink-600 shadow-[0_0_100px_rgba(255,0,110,0.4)]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-pink-600 mx-auto flex items-center justify-center text-3xl font-bold shadow-[0_0_30px_#ff006e]">
            !
          </div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase text-white">Kernel Access Required</h2>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest leading-relaxed">
            Video synthesis requires a high-priority API key from a paid GCP project. Standard free keys are restricted.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleOpenSelect}
            className="w-full py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,0,110,0.3)]"
          >
            Authenticate Protocol
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center text-[10px] text-pink-600/70 hover:text-pink-400 font-bold uppercase tracking-widest transition-colors"
          >
            Billing Documentation // v3.1
          </a>
        </div>
      </div>
    </div>
  );
};
