import React from 'react';
import { 
  DollarSign, 
  Package, 
  FileText, 
  TrendingUp, 
  PlusCircle, 
  Search, 
  Bot, 
  FileCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { Articulo, Cotizacion, Estadisticas } from '../types';
import { formatearMoneda, formatearFecha } from '../data/mockData';

interface PantallaInicioProps {
  articulos: Articulo[];
  cotizaciones: Cotizacion[];
  estadisticas: Estadisticas;
  setPantallaActual: (pantalla: string) => void;
  onSeleccionarCotizacion: (cot: Cotizacion) => void;
  onAbrirArchivos: () => void;
}

export const PantallaInicio: React.FC<PantallaInicioProps> = ({
  articulos,
  cotizaciones,
  estadisticas,
  setPantallaActual,
  onSeleccionarCotizacion,
  onAbrirArchivos
}) => {
  const cotizacionesRecientes = cotizaciones.slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      
      {/* Hero Welcome & Quick Notice */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 sm:p-6 text-[#e0e0e0] relative overflow-hidden border border-[#1a1a1a]">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#141414] text-[#c5a059] border border-[#c5a059]/30 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>INNMEX ERP • Sistema Android APK 1.0</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
            <img 
              src="/innmex_logo.png" 
              alt="INNMEX SOLUCIONES Logo" 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl border border-[#c5a059]/50 bg-black p-1 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif italic text-white tracking-wide">
                INNMEX SOLUCIONES
              </h1>
              <p className="text-[#c5a059] text-xs sm:text-sm font-semibold tracking-wide mt-0.5">
                SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS.
              </p>
            </div>
          </div>

          <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed mb-4">
            Gestión comercial y cotizaciones en tiempo real tipo Odoo. Genera presupuestos, busca artículos al instante, calcula impuestos y emite PDFs profesionales con sellos digitales INNMEX.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              id="btn-inicio-nueva-cot"
              onClick={() => setPantallaActual('cotizacion')}
              className="inline-flex items-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Cotización</span>
            </button>

            <button
              id="btn-inicio-chat-ia"
              onClick={() => setPantallaActual('ia')}
              className="inline-flex items-center space-x-2 bg-[#141414] hover:bg-[#1a1a1a] text-stone-200 border border-[#1a1a1a] hover:border-[#c5a059]/40 font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              <Bot className="w-4 h-4 text-[#c5a059]" />
              <span>Consultar Mini Rey IA</span>
            </button>

            <button
              id="btn-inicio-compilar-apk"
              onClick={onAbrirArchivos}
              className="inline-flex items-center space-x-2 bg-[#141414] hover:bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 font-medium text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Compilar APK (EAS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Monto Total */}
        <div className="bg-[#111111] rounded-xl p-5 border border-[#1a1a1a] hover:border-[#c5a059]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Monto Cotizado</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/20 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-white truncate">
            {formatearMoneda(estadisticas.totalMonto)}
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-[#c5a059]" />
            <span className="text-stone-400 text-[11px]">{cotizaciones.length} operaciones emitidas</span>
          </div>
          <div className="mt-3 h-[1px] bg-gradient-to-r from-[#c5a059]/40 to-transparent" />
        </div>

        {/* Card 2: Total Cotizaciones */}
        <div className="bg-[#111111] rounded-xl p-5 border border-[#1a1a1a] hover:border-[#c5a059]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Cotizaciones</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-white">
            {estadisticas.totalCotizaciones}
          </div>
          <div className="flex items-center text-xs mt-2 text-stone-400">
            <span className="text-emerald-400 font-medium mr-1">{estadisticas.cotizacionesAprobadas} aprobadas</span>
            <span>• {estadisticas.cotizacionesPendientes} pendientes</span>
          </div>
          <div className="mt-3 h-[1px] bg-gradient-to-r from-[#c5a059]/40 to-transparent" />
        </div>

        {/* Card 3: Tasa de Aprobación */}
        <div className="bg-[#111111] rounded-xl p-5 border border-[#1a1a1a] hover:border-[#c5a059]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Aprobación</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] flex items-center justify-center">
              <FileCheck className="w-3.5 h-3.5 text-[#c5a059]" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-white">
            {estadisticas.tasaAprobacion}%
          </div>
          <div className="w-full bg-[#1c1c1c] rounded-full h-1.5 mt-3">
            <div 
              className="bg-[#c5a059] h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(estadisticas.tasaAprobacion, 100)}%` }}
            />
          </div>
          <div className="mt-2.5 h-[1px] bg-gradient-to-r from-[#c5a059]/40 to-transparent" />
        </div>

        {/* Card 4: Total Artículos en Catálogo */}
        <div className="bg-[#111111] rounded-xl p-5 border border-[#1a1a1a] hover:border-[#c5a059]/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Catálogo IT</span>
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-[#c5a059]" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-serif font-bold text-white">
            {articulos.length}
          </div>
          <div className="flex items-center text-xs text-stone-400 mt-2">
            <span className="text-[11px]">Búsqueda instantánea en vivo</span>
          </div>
          <div className="mt-3 h-[1px] bg-gradient-to-r from-[#c5a059]/40 to-transparent" />
        </div>

      </div>

      {/* Quick Access Menu */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a]">
        <h2 className="text-[11px] font-mono uppercase tracking-widest text-stone-400 mb-3">
          Accesos Directos
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <button
            id="btn-quick-new-quote"
            onClick={() => setPantallaActual('cotizacion')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#1a1a1a] bg-[#111111] hover:border-[#c5a059]/40 hover:bg-[#151515] transition-all text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Crear Cotización</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Formulario tipo Odoo</span>
          </button>

          <button
            id="btn-quick-catalog"
            onClick={() => setPantallaActual('busqueda')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#1a1a1a] bg-[#111111] hover:border-[#c5a059]/40 hover:bg-[#151515] transition-all text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Catálogo IT</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Stock y precios en vivo</span>
          </button>

          <button
            id="btn-quick-history"
            onClick={() => setPantallaActual('historial')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#1a1a1a] bg-[#111111] hover:border-[#c5a059]/40 hover:bg-[#151515] transition-all text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Historial de Ventas</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Filtro por estado</span>
          </button>

          <button
            id="btn-quick-ai"
            onClick={() => setPantallaActual('ia')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#1a1a1a] bg-[#111111] hover:border-[#c5a059]/40 hover:bg-[#151515] transition-all text-center group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Mini Rey IA</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Ingeniero Virtual 40 • Redes & CCTV</span>
          </button>

        </div>
      </div>

      {/* Recent Quotations Section */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a1a1a]">
          <div>
            <h2 className="text-sm font-serif italic text-white tracking-wide">Cotizaciones Recientes</h2>
            <p className="text-[11px] text-stone-400">Últimos documentos emitidos en el sistema</p>
          </div>
          <button
            id="btn-view-all-quotes"
            onClick={() => setPantallaActual('historial')}
            className="text-xs font-medium text-[#c5a059] hover:text-[#d4b068] flex items-center space-x-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#161616]">
          {cotizacionesRecientes.map((cot) => {
            const esAprobada = cot.estado === 'aprobada';
            const esRechazada = cot.estado === 'rechazada';

            return (
              <div
                key={cot.id}
                id={`recent-cot-${cot.id}`}
                onClick={() => onSeleccionarCotizacion(cot)}
                className="py-3 px-2 flex items-center justify-between hover:bg-[#141414] rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    esAprobada 
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                      : esRechazada 
                        ? 'bg-rose-950/40 text-rose-400 border-rose-800/40' 
                        : 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                  }`}>
                    {esAprobada ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : esRechazada ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-white">{cot.numero}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase border ${
                        esAprobada 
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' 
                          : esRechazada 
                            ? 'bg-rose-950/50 text-rose-400 border-rose-800/50' 
                            : 'bg-amber-950/50 text-amber-400 border-amber-800/50'
                      }`}>
                        {cot.estado}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 truncate max-w-[200px] sm:max-w-xs font-medium mt-0.5">
                      {cot.clienteNombre} {cot.empresa ? `• ${cot.empresa}` : ''}
                    </p>
                    <span className="text-[10px] text-stone-400">{formatearFecha(cot.fecha)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-right">
                  <div>
                    <div className="text-sm font-serif font-bold text-[#c5a059]">
                      {formatearMoneda(cot.total)}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {cot.items.length} {cot.items.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
