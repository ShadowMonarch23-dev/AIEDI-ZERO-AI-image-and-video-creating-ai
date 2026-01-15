
import React, { useState } from 'react';
import { GenJob, GenType } from '../types';

interface MediaCardProps {
  job: GenJob;
}

export const MediaCard: React.FC<MediaCardProps> = ({ job }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAspectClass = () => {
    switch (job.config.aspectRatio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-square';
    }
  };

  const fileName = `aiedi-zero-${job.id}.${job.type === GenType.VIDEO ? 'mp4' : 'png'}`;

  return (
    <div 
      className="glass-panel rounded-none overflow-hidden group hover:shadow-[0_0_30px_rgba(255,0,110,0.15)] transition-all duration-500 border-pink-600/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${getAspectClass()} bg-slate-950 relative overflow-hidden`}>
        {job.mediaUrl ? (
          job.type === GenType.VIDEO ? (
            <video 
              src={job.mediaUrl} 
              autoPlay 
              loop 
              muted 
              controls
              controlsList="nodownload"
              playsInline
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <img 
              src={job.mediaUrl} 
              alt={job.prompt}
              className="w-full h-full object-cover grayscale-[0.3] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-pink-900 font-bold uppercase text-[10px] tracking-widest">Synthesis Failed</span>
          </div>
        )}
        
        {/* Overlay Info - pointer-events-none to ensure it doesn't block video controls */}
        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-10">
           <span className="px-2 py-0.5 bg-black/80 border border-pink-600/50 text-pink-500 text-[7px] font-bold tracking-widest uppercase backdrop-blur-md">
             {job.type} // {job.config.aspectRatio}
           </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
      </div>
      
      <div className="p-4 space-y-3 bg-black">
        <p className="text-[10px] text-slate-400 line-clamp-2 uppercase tracking-tight leading-relaxed font-mono">
          <span className="text-pink-600 mr-2">/BUFFER_DATA:</span>
          {job.prompt}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 font-bold tracking-widest uppercase">
              {new Date(job.createdAt).toLocaleTimeString()}
            </span>
            <span className="text-[7px] text-pink-900 font-mono">ID: {job.id}</span>
          </div>
          <div className="flex gap-2">
            <a 
              href={job.mediaUrl} 
              download={fileName}
              className="flex items-center gap-2 px-3 py-1.5 bg-pink-600/10 hover:bg-pink-600 text-pink-500 hover:text-white border border-pink-600/30 transition-all active:scale-95 group/btn"
              title={`Download ${job.type}`}
            >
              <span className="text-[8px] font-bold tracking-widest uppercase hidden group-hover/btn:block">Download</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
