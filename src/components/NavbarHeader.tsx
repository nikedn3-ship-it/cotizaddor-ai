import React from 'react';
import { Smartphone, Monitor, ShoppingBag, FolderArchive, Sparkles, Building2 } from 'lucide-react';

interface NavbarHeaderProps {
  pantallaActual: string;
  setPantallaActual: (p: string) => void;
  modoVista: 'android' | 'desktop';
  setModoVista: (m: 'android' | 'desktop') => void;
  cantidadCarrito: number;
  onAbrirCarrito: () => void;
  onAbrirArchivos: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  pantallaActual,
  setPantallaActual,
  modoVista,
  setModoVista,
  cantidadCarrito,
  onAbrirCarrito,
  onAbrirArchivos
}) => {
  return (
    <header className="bg-[#0d0d0d] text-[#e0e0e0] border-b border-[#1a1a1a] sticky top-0 z-30 no-print backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => setPantallaActual('inicio')}
          className="flex items-center space-x-3 cursor-pointer select-none group"
          id="btn-brand-home"
        >
          <img 
            src="/innmex_logo.png" 
            alt="INNMEX SOLUCIONES" 
            className="w-10 h-10 object-contain rounded-lg border border-[#c5a059]/40 bg-black p-0.5 shadow-md group-hover:border-[#c5a059] transition-all"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif italic text-lg sm:text-xl font-bold tracking-wider text-[#c5a059]">
                INNMEX SOLUCIONES
              </span>
              <span className="bg-[#1a1a1a] text-[#c5a059] text-[9px] px-1.5 py-0.5 rounded border border-[#c5a059]/30 font-mono">
                v1.0.0
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-stone-300 font-medium tracking-tight">
              SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS.
            </p>
          </div>
        </div>

        {/* Quick actions & Toggles */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* View mode toggle (Android Phone Frame vs Desktop ERP) */}
          <div className="bg-[#111111] p-1 rounded-lg border border-[#1a1a1a] flex items-center">
            <button
              id="btn-toggle-android"
              onClick={() => setModoVista('android')}
              title="Vista Simulador Celular Android APK"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                modoVista === 'android'
                  ? 'bg-[#1c1c1c] text-[#c5a059] border border-[#c5a059]/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulador APK</span>
            </button>
            <button
              id="btn-toggle-desktop"
              onClick={() => setModoVista('desktop')}
              title="Vista ERP Completa de Escritorio"
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                modoVista === 'desktop'
                  ? 'bg-[#1c1c1c] text-[#c5a059] border border-[#c5a059]/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Pantalla Completa</span>
            </button>
          </div>

          {/* Archivos APK / EAS Build button */}
          <button
            id="btn-modal-archivos-apk"
            onClick={onAbrirArchivos}
            className="flex items-center space-x-1.5 bg-[#141414] hover:bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/40 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all"
            title="Ver los 19 archivos del proyecto y compilar APK"
          >
            <FolderArchive className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Archivos APK (19)</span>
          </button>

          {/* Cart button with floating badge */}
          <button
            id="btn-header-cart"
            onClick={onAbrirCarrito}
            className="relative p-2 rounded-lg bg-[#111111] hover:bg-[#181818] text-[#e0e0e0] hover:text-white transition-all border border-[#1a1a1a] hover:border-[#c5a059]/40"
            title="Ver Carrito de Compra"
          >
            <ShoppingBag className="w-4 h-4 text-[#e0e0e0]" />
            {cantidadCarrito > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#c5a059] text-black text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                {cantidadCarrito}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
