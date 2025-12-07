
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, Sparkles, ChevronUp, Download, MoreHorizontal } from 'lucide-react';
import { Button, Slider, Popover, Tooltip, cn } from './ui/Components';

interface AudioPlayerProps {
  projectTitle: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ projectTitle }) => {
  // State
  const [isReady, setIsReady] = useState(false); // false = Idle/CTA, true = Player
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(340); // Mock 5:40 duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(80);

  // Mock Audio Progress
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000 / playbackSpeed);
    } else if (currentTime >= duration) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, playbackSpeed]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setIsReady(true);
      setIsPlaying(true);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (val: number) => {
    setCurrentTime(val);
  };

  // --- Render Idle State (CTA) ---
  if (!isReady) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 flex items-center justify-center px-4 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "rounded-full px-6 py-6 text-base shadow-lg transition-all hover:scale-105",
              "bg-gradient-to-r from-violet-600 to-indigo-600 border-0"
            )}
          >
            {isGenerating ? (
               <span className="flex items-center gap-2">
                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                 Đang tổng hợp giọng nói...
               </span>
            ) : (
               <span className="flex items-center gap-2">
                 <Sparkles className="w-5 h-5 fill-white/20" />
                 Tạo tóm tắt Audio
               </span>
            )}
          </Button>
          <span className="text-xs text-slate-500 font-medium hidden md:inline-block">
            Biến tài liệu thành podcast chuyên sâu (Dự kiến: ~2 phút)
          </span>
        </div>
      </div>
    );
  }

  // --- Render Active Player ---
  return (
    <div className="fixed bottom-0 left-0 w-full h-20 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 transition-all duration-300">
      
      {/* 1. Meta Info (Left) */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
           {isPlaying ? (
             <div className="flex items-end justify-center gap-0.5 h-6 pb-1">
               <div className="w-1 bg-indigo-500 animate-[pulse_1s_ease-in-out_infinite] h-3" />
               <div className="w-1 bg-indigo-500 animate-[pulse_1.5s_ease-in-out_infinite] h-5" />
               <div className="w-1 bg-indigo-500 animate-[pulse_0.8s_ease-in-out_infinite] h-2" />
               <div className="w-1 bg-indigo-500 animate-[pulse_1.2s_ease-in-out_infinite] h-4" />
             </div>
           ) : (
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
               <Volume2 className="w-4 h-4 text-indigo-600" />
             </div>
           )}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-slate-900 text-sm truncate pr-2">Tổng quan Audio: {projectTitle}</h4>
          <p className="text-xs text-slate-500 truncate">Host & Chuyên gia đang thảo luận...</p>
        </div>
      </div>

      {/* 2. Controls (Center) */}
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {/* Buttons */}
        <div className="flex items-center gap-6 mb-1">
          <button 
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md hover:bg-slate-800"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>

          <button 
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Scrubber */}
        <div className="w-full flex items-center gap-3 text-xs font-mono text-slate-500">
           <span>{formatTime(currentTime)}</span>
           <Slider 
             value={currentTime} 
             max={duration} 
             onChange={handleSeek} 
             className="flex-1"
           />
           <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Options (Right) */}
      <div className="flex items-center justify-end gap-3 hidden md:flex">
        {/* Speed */}
        <Popover 
          trigger={
            <button className="text-xs font-medium text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors w-10">
              {playbackSpeed}x
            </button>
          }
          content={
            <div className="flex flex-col bg-white rounded-lg shadow-xl border border-slate-100 p-1 min-w-[80px]">
              {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                <button 
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={cn(
                    "px-3 py-1.5 text-xs text-left hover:bg-slate-50 rounded-md",
                    playbackSpeed === speed ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-600"
                  )}
                >
                  {speed}x
                </button>
              ))}
            </div>
          }
        />

        {/* Volume */}
        <div className="group relative flex items-center">
           <button className="p-2 text-slate-400 hover:text-slate-700">
             <Volume2 className="w-5 h-5" />
           </button>
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block p-3 bg-white rounded-lg shadow-xl border border-slate-100 w-8 h-24 animate-in fade-in zoom-in-95 duration-200">
              <div className="h-full relative w-full flex justify-center">
                 {/* Vertical Slider Simulation */}
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   value={volume}
                   onChange={(e) => setVolume(Number(e.target.value))}
                   className="absolute h-full w-full opacity-0 cursor-pointer z-10"
                   style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} 
                 />
                 <div className="w-1.5 h-full bg-slate-200 rounded-full relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-600 rounded-full"
                      style={{ height: `${volume}%` }}
                    />
                 </div>
              </div>
           </div>
        </div>

        <Tooltip content="Tải MP3">
           <button className="p-2 text-slate-400 hover:text-slate-700">
             <Download className="w-5 h-5" />
           </button>
        </Tooltip>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
