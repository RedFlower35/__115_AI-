/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Trophy, Users, Monitor } from 'lucide-react';

interface TimerProps {
  id: string;
  name: string;
  color: string;
  accent: string;
  controlsClassName?: string;
}

const Timer = ({ id, name, color, accent, controlsClassName }: TimerProps) => {
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - time;
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      mm: minutes.toString().padStart(2, '0'),
      ss: seconds.toString().padStart(2, '0'),
      cc: centiseconds.toString().padStart(2, '0'),
    };
  };

  const t = formatTime(time);

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col bg-[#14181f] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
    >
      <div className="px-8 pt-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Station {id}</span>
          <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-2">
            {name.split(' (')[0]} <span className={`${accent} text-transparent bg-clip-text font-semibold`}>{name.split(' (')[1]?.replace(')', '') || ''}</span>
          </h2>
        </div>
        <div className={`px-3 py-1 rounded-full ${isRunning ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'} border text-[10px] font-bold uppercase tracking-tighter`}>
          Status: {isRunning ? 'Active' : 'Ready'}
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-[80px] md:text-[120px] lg:text-[160px] font-mono font-bold tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {t.mm}:{t.ss}
            <span className="text-2xl md:text-4xl text-white/20 ml-2">.{t.cc}</span>
          </div>
          <span className="block text-[10px] md:text-xs text-center font-sans font-medium tracking-[0.8em] md:tracking-[1em] opacity-30 mt-4 uppercase">
            分鐘 : 秒數 : 毫秒
          </span>
        </div>
      </div>

      <div className={`p-6 grid grid-cols-3 gap-4 bg-white/5 ${controlsClassName}`}>
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.button
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={startTimer}
              className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/60 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Play fill="#10b981" size={18} className="translate-x-0.5 text-emerald-500" />
              </div>
              <span className="text-lg font-bold tracking-widest text-emerald-500">開始</span>
            </motion.button>
          ) : (
            <motion.button
              key="pause"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={pauseTimer}
              className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:bg-amber-900/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <Pause fill="#f59e0b" size={18} className="text-amber-500" />
              </div>
              <span className="text-lg font-bold tracking-widest text-amber-500">暫停</span>
            </motion.button>
          )}
        </AnimatePresence>
        
        <button
          onClick={pauseTimer}
          disabled={!isRunning}
          className={`flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-slate-900/40 border border-white/5 transition-all ${!isRunning ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800/60'}`}
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Pause size={18} className="text-white/40" />
          </div>
          <span className="text-lg font-bold tracking-widest text-white/20">暫停</span>
        </button>

        <button
          onClick={resetTimer}
          className="flex flex-col items-center justify-center gap-3 py-8 rounded-2xl bg-red-950/30 border border-red-500/30 hover:bg-red-900/50 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <RotateCcw size={18} className="text-red-500" />
          </div>
          <span className="text-lg font-bold tracking-widest text-red-500">重設</span>
        </button>
      </div>
    </motion.section>
  );
};

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] text-[#e0e0e0] font-sans selection:bg-blue-500 selection:text-white">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 bg-[#0f1117]">
        <div className="flex flex-col">
          <h1 className="text-xs font-bold tracking-[0.4em] text-blue-400 uppercase flex items-center gap-2">
            <Trophy size={14} />
            班級對抗賽計時系統
          </h1>
          <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">獨立雙軌追蹤計時器</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-10">
          <h2 className="text-xl font-bold text-blue-400/80 tracking-widest drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">職能發展學院-App</h2>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="hidden md:block text-[10px] text-white/40 font-mono tracking-widest uppercase">
            STABLE // INDEP_SYNC_OFF
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-8 bg-[#0a0c10]">
        <Timer 
          id="01"
          name="二年1班" 
          color="border-blue-500/20" 
          accent="text-blue-400" 
          controlsClassName="border-[4px] border-[#c7ea2e] rounded-[24px]"
        />
        <Timer 
          id="02"
          name="二年2班" 
          color="border-purple-500/20" 
          accent="text-purple-400" 
          controlsClassName="border-[4px] border-[#c7ea2e] rounded-[24px]"
        />
      </main>

      <footer className="px-6 md:px-12 py-4 border-t border-white/5 bg-[#0a0c10] flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] text-white/20 tracking-widest uppercase">
        <div className="flex gap-4 md:gap-8">
          <span>會話 ID: TR-{Math.floor(Math.random() * 9000) + 1000}</span>
          <span>協議: 獨立併行計時</span>
        </div>
        <div className="flex gap-4">
          <span>版本 2024.11.02</span>
          <span className="text-blue-400/50 flex items-center gap-1">
            <Monitor size={10} />
            高精度邏輯引擎
          </span>
        </div>
      </footer>
    </div>
  );
}
