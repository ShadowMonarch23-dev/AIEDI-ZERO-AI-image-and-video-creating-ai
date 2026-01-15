
import React from 'react';
import { GenJob } from '../types';

interface MediaCardProps {
  job: GenJob;
}

export const MediaCard: React.FC<MediaCardProps> = ({ job }) => {
  const getAspectClass = () => {
    switch (job.config.aspectRatio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': return 'aspect-[4/3]';
      case '3:4': return 'aspect-[3/4]';
      default: return 'aspect-square';
    }
  };

  return (
    <div className="glass-panel rounded-none overflow-hidden group hover:shadow-[0_0_30px_rgba(255,0,110,0.15)] transition-all duration-500 border-pink-600/30">
      <div className={`${getAspectClass()} bg-slate-950 relative overflow-hidden`}>
        {job.imageUrl ? (
          <img 
            src={job.imageUrl} 
            alt={job.prompt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-pink-900 font-bold uppercase text-[10px] tracking-widest">Synthesis Failed</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      <div className="p-4 space-y-3 bg-black">
        <p className="text-[10px] text-slate-400 line-clamp-2 uppercase tracking-tight leading-relaxed font-mono">
          <span className="text-pink-600 mr-2">/PROMPT:</span>
          {job.prompt}
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-[8px] text-slate-600 font-bold tracking-widest uppercase">
            {new Date(job.createdAt).toLocaleTimeString()} // ID: {job.id}
          </span>
          <div className="flex gap-2">
            <a 
              href={job.imageUrl} 
              download={`aiedi-zero-${job.id}.png`}
              className="p-2 bg-pink-600/10 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-600/30 transition-all active:scale-95"
              title="Export Asset"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
