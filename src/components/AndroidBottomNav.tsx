import React from 'react';
import { Home, Search, FilePlus, Clock, Bot } from 'lucide-react';

interface AndroidBottomNavProps {
  pantallaActual: string;
  setPantallaActual: (pantalla: string) => void;
  cantidadCarrito: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  pantallaActual,
  setPantallaActual,
  cantidadCarrito
}) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'busqueda', label: 'Artículos', icon: Search, badge: cantidadCarrito },
    { id: 'cotizacion', label: 'Cotizar', icon: FilePlus },
    { id: 'historial', label: 'Historial', icon: Clock },
    { id: 'ia', label: 'Mini Rey IA', icon: Bot }
  ];

  return (
    <nav className="bg-[#0d0d0d] border-t border-[#1a1a1a] text-stone-400 py-1.5 px-2 flex justify-around items-center select-none no-print shadow-2xl z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pantallaActual === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => setPantallaActual(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#c5a059] font-medium scale-105'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#c5a059] stroke-[2.2]' : 'stroke-[1.6]'}`} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#c5a059] text-black text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-wider uppercase font-medium">{tab.label}</span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-[#c5a059] mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
