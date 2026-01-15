
import React, { useState, useEffect, useRef } from 'react';
import { GenStatus, GenJob, GenerationParams, GenType } from './types';
import { generateMedia } from './services/geminiService';
import { LoadingScreen } from './components/LoadingScreen';
import { MediaCard } from './components/MediaCard';
import { ApiKeyOverlay } from './components/ApiKeyOverlay';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [genType, setGenType] = useState<GenType>(GenType.IMAGE);
  const [startImage, setStartImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenStatus>(GenStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenJob[]>([]);
  const [showKeyOverlay, setShowKeyOverlay] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aiedi-zero-history-v2');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStartImage(reader.result as string);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const checkAccess = async () => {
    if (genType === GenType.VIDEO) {
      const hasKey = await window.aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        setShowKeyOverlay(true);
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Pre-flight access check for Video
    const canProceed = await checkAccess();
    if (!canProceed) return;
    
    setStatus(GenStatus.GENERATING);
    setError(null);
    setShowKeyOverlay(false);

    const params: GenerationParams = {
      prompt,
      aspectRatio,
      startImage: startImage || undefined,
      type: genType
    };

    try {
      const mediaUrl = await generateMedia(params);
      const newJob: GenJob = {
        id: Math.random().toString(36).substr(2, 7).toUpperCase(),
        prompt,
        status: GenStatus.COMPLETED,
        mediaUrl,
        type: genType,
        createdAt: Date.now(),
        config: { aspectRatio }
      };
      
      const newHistory = [newJob, ...history];
      setHistory(newHistory);
      localStorage.setItem('aiedi-zero-history-v2', JSON.stringify(newHistory));
      setStatus(GenStatus.COMPLETED);
    } catch (err: any) {
      console.error("Synthesis Failed:", err);
      const msg = err.message || '';
      
      // Auto-trigger key selection if model is not found (typical for free keys accessing Veo)
      if (msg.includes("not found") || msg.includes("MODEL_UNAVAILABLE") || msg.includes("ACCESS_DENIED")) {
        setShowKeyOverlay(true);
        setStatus(GenStatus.IDLE);
        return;
      }

      let errorMsg = msg;
      if (msg.includes('safety') || msg.includes('BLOCK_NONE')) {
        errorMsg = "KERNEL_FILTER: Safety intercept. Modify prompt constraints.";
      } else if (msg.includes("400")) {
        errorMsg = "INVALID_REQUEST: Protocol mismatch. Resetting synthesis parameters.";
      }
      
      setError(errorMsg);
      setStatus(GenStatus.FAILED);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-mono overflow-x-hidden selection:bg-pink-600 selection:text-white">
      {showKeyOverlay && <ApiKeyOverlay onSuccess={handleGenerate} />}
      
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-50"></div>

      {/* Header Dashboard */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-pink-600/30 px-6 py-4 shadow-[0_0_30px_rgba(255,0,110,0.15)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-600 flex items-center justify-center font-bold text-2xl shadow-[0_0_20px_#ff006e]">0</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter neon-text">AIEDI ZERO</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-600 rounded-full animate-pulse shadow-[0_0_10px_#ff006e]"></span>
                <span className="text-[10px] text-pink-500 font-bold uppercase tracking-[0.3em]">Protocol: {genType}</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-900 p-1 border border-white/5 gap-1">
            <button 
              onClick={() => { setGenType(GenType.IMAGE); setAspectRatio('1:1'); }}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${genType === GenType.IMAGE ? 'bg-pink-600 text-white shadow-[0_0_15px_#ff006e]' : 'text-slate-500 hover:text-white'}`}
            >
              Static
            </button>
            <button 
              onClick={() => { setGenType(GenType.VIDEO); setAspectRatio('16:9'); }}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${genType === GenType.VIDEO ? 'bg-pink-600 text-white shadow-[0_0_15px_#ff006e]' : 'text-slate-500 hover:text-white'}`}
            >
              Motion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Creation Panel */}
        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white/90">Command Center</h2>
              <span className="px-2 py-0.5 border border-pink-600/50 text-pink-500 text-[8px] font-bold tracking-widest uppercase">SYNERGY READY</span>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`INJECT_${genType}_PROMPT...`}
              className="w-full h-48 bg-black border border-pink-600/20 p-4 focus:border-pink-600 outline-none transition-all resize-none text-white placeholder:text-slate-800 font-mono text-sm leading-relaxed"
            />

            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500 block">Frame Geometry</label>
              <div className="grid grid-cols-5 gap-2">
                {(genType === GenType.IMAGE ? ['1:1', '16:9', '9:16', '4:3', '3:4'] : ['16:9', '9:16']).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio as any)}
                    className={`py-3 text-[10px] font-bold transition-all border ${
                      aspectRatio === ratio 
                        ? 'bg-pink-600 border-pink-600 text-white shadow-[0_0_15px_#ff006e]' 
                        : 'bg-black border-slate-900 text-slate-600 hover:border-pink-600/40 hover:text-pink-400'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">Seed Buffer</label>
                {startImage && (
                  <button onClick={() => setStartImage(null)} className="text-[8px] font-bold text-pink-600 uppercase tracking-widest">Purge</button>
                )}
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-32 border border-dashed flex items-center justify-center cursor-pointer transition-all ${startImage ? 'border-pink-600 bg-pink-600/5' : 'border-slate-900 hover:border-pink-600/30'}`}
              >
                {startImage ? (
                  <img src={startImage} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <span className="text-slate-700 text-[9px] font-bold uppercase tracking-[0.5em]">Upload Reference</span>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <button
              disabled={status === GenStatus.GENERATING || !prompt.trim()}
              onClick={handleGenerate}
              className={`w-full py-6 font-bold text-xl uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 border ${
                status === GenStatus.GENERATING || !prompt.trim()
                ? 'bg-slate-950 text-slate-800 border-slate-900'
                : 'bg-pink-600 hover:bg-pink-500 text-white border-pink-600 shadow-[0_0_40px_rgba(255,0,110,0.4)] active:scale-[0.98]'
              }`}
            >
              {status === GenStatus.GENERATING ? "PROCESSING..." : `SYNTHESIZE ${genType}`}
            </button>

            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-tighter leading-relaxed">
                <span className="text-red-600 mr-2">[FAULT]</span> {error}
              </div>
            )}
          </section>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-7 space-y-8">
          {status === GenStatus.GENERATING ? (
            <LoadingScreen />
          ) : (
            <section className="space-y-8 animate-in fade-in duration-1000">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-pink-500">History Feed</h2>
                <span className="text-[10px] text-slate-700 font-mono tracking-widest uppercase">{history.length} Assets Loaded</span>
              </div>
              
              {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {history.map(job => <MediaCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="p-32 flex flex-col items-center justify-center text-center opacity-20 border border-dashed border-white/5">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.8em]">Buffer Offline</h3>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
