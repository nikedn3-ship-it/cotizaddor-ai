import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  modoVista: 'android' | 'desktop';
  setModoVista: (modo: 'android' | 'desktop') => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  modoVista,
  setModoVista
}) => {
  const [hora, setHora] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHora(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (modoVista === 'desktop') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300">
        {children}
      </main>
    );
  }

  // Android Phone Simulator Frame
  return (
    <div className="py-6 px-2 flex flex-col items-center justify-center min-h-[calc(100vh-70px)] bg-[#070707] transition-all duration-300">
      
      {/* Device notice banner */}
      <div className="mb-3 text-xs text-stone-400 font-medium flex items-center space-x-2 no-print">
        <Smartphone className="w-4 h-4 text-[#c5a059]" />
        <span>Simulador de Android APK (Pixel 8 / Galaxy S24)</span>
        <span>•</span>
        <button
          onClick={() => setModoVista('desktop')}
          className="text-[#c5a059] hover:text-[#d4b068] font-bold underline flex items-center space-x-0.5"
        >
          <span>Expandir a Pantalla Completa</span>
          <Maximize2 className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Phone Body */}
      <div className="w-full max-w-[430px] h-[850px] bg-[#0d0d0d] rounded-[48px] p-3 shadow-2xl border-4 border-[#1f1f1f] relative flex flex-col overflow-hidden ring-1 ring-[#c5a059]/20">
        
        {/* Speaker / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#141414] rounded-full flex items-center justify-center space-x-3 z-30 pointer-events-none border border-[#1f1f1f]">
          <div className="w-10 h-1 bg-stone-700 rounded-full" />
          <div className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-stone-800" />
        </div>

        {/* Android Screen Display */}
        <div className="w-full h-full bg-[#0a0a0a] text-[#e0e0e0] rounded-[38px] overflow-hidden flex flex-col relative border border-[#1a1a1a]">
          
          {/* Android Status Bar */}
          <div className="h-7 bg-[#0d0d0d] text-stone-300 px-6 flex items-center justify-between text-[11px] font-semibold select-none z-20 shrink-0 border-b border-[#1a1a1a]">
            <span>{hora || '12:00'}</span>
            <div className="flex items-center space-x-2 text-stone-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4 text-[#c5a059]" />
            </div>
          </div>

          {/* Screen Inner Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 scrollbar-none bg-[#0a0a0a]">
            {children}
          </div>

          {/* Android Gesture Pill */}
          <div className="h-5 bg-[#0d0d0d] flex items-center justify-center select-none shrink-0 no-print border-t border-[#1a1a1a]">
            <div className="w-28 h-1 bg-stone-700 rounded-full" />
          </div>

        </div>

      </div>
    </div>
  );
};
