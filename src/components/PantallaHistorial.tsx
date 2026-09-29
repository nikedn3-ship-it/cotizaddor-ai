import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  ChevronRight, 
  ArrowUpDown,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';
import { Cotizacion, EstadoCotizacion } from '../types';
import { formatearMoneda, formatearFecha } from '../data/mockData';

interface PantallaHistorialProps {
  cotizaciones: Cotizacion[];
  onSeleccionarCotizacion: (cot: Cotizacion) => void;
  onCambiarEstado: (cotId: string, nuevoEstado: EstadoCotizacion) => void;
  onNuevaCotizacion: () => void;
}

export const PantallaHistorial: React.FC<PantallaHistorialProps> = ({
  cotizaciones,
  onSeleccionarCotizacion,
  onCambiarEstado,
  onNuevaCotizacion
}) => {
  const [filtroEstado, setFiltroEstado] = useState<'todas' | EstadoCotizacion>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<'recientes' | 'monto_mayor' | 'monto_menor'>('recientes');

  // Filter and sort
  const cotizacionesFiltradas = useMemo(() => {
    return cotizaciones
      .filter(cot => {
        const coincideEstado = filtroEstado === 'todas' || cot.estado === filtroEstado;
        const coincideBusqueda = 
          cot.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
          cot.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          cot.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
          cot.email.toLowerCase().includes(busqueda.toLowerCase());

        return coincideEstado && coincideBusqueda;
      })
      .sort((a, b) => {
        if (orden === 'monto_mayor') return b.total - a.total;
        if (orden === 'monto_menor') return a.total - b.total;
        // recientes default
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      });
  }, [cotizaciones, filtroEstado, busqueda, orden]);

  const sumaMontoFiltrado = cotizacionesFiltradas.reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header */}
      <div className="bg-[#0d0d0d] rounded-2xl p-4 sm:p-5 border border-[#1a1a1a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-serif italic text-white tracking-wide">Historial de Cotizaciones</h1>
            <p className="text-xs text-stone-400">Consulta presupuestos emitidos, revisa estados y genera PDFs</p>
          </div>

          <button
            id="btn-historial-nueva-cot"
            onClick={onNuevaCotizacion}
            className="inline-flex items-center space-x-1.5 bg-[#c5a059] hover:bg-[#d4b068] text-black font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-auto transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Cotización</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-buscar-historial"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por número (COT-...), cliente, empresa..."
            className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#1a1a1a]">
          
          <div className="flex space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setFiltroEstado('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filtroEstado === 'todas'
                  ? 'bg-[#c5a059] text-black font-semibold'
                  : 'bg-[#141414] text-stone-400 hover:text-white border border-[#1a1a1a]'
              }`}
            >
              Todas ({cotizaciones.length})
            </button>

            <button
              onClick={() => setFiltroEstado('pendiente')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1 ${
                filtroEstado === 'pendiente'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-[#141414] text-stone-400 hover:text-amber-300 border border-[#1a1a1a]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pendientes</span>
            </button>

            <button
              onClick={() => setFiltroEstado('aprobada')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1 ${
                filtroEstado === 'aprobada'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-[#141414] text-stone-400 hover:text-emerald-300 border border-[#1a1a1a]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Aprobadas</span>
            </button>

            <button
              onClick={() => setFiltroEstado('rechazada')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1 ${
                filtroEstado === 'rechazada'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'bg-[#141414] text-stone-400 hover:text-rose-300 border border-[#1a1a1a]'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Rechazadas</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-1 text-xs text-stone-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={orden}
              onChange={(e: any) => setOrden(e.target.value)}
              className="bg-[#111111] border border-[#1a1a1a] rounded-lg px-2 py-1 text-xs text-stone-300 outline-none focus:border-[#c5a059]/60"
            >
              <option value="recientes">Más recientes</option>
              <option value="monto_mayor">Mayor monto</option>
              <option value="monto_menor">Menor monto</option>
            </select>
          </div>

        </div>

      </div>

      {/* Sub-bar with count & total */}
      <div className="flex items-center justify-between px-2 text-xs text-stone-400 font-medium">
        <span>{cotizacionesFiltradas.length} documentos listados</span>
        <span>Monto acumulado: <strong className="text-[#c5a059] font-serif font-bold">{formatearMoneda(sumaMontoFiltrado)}</strong></span>
      </div>

      {/* List of Quotes */}
      <div className="space-y-3">
        {cotizacionesFiltradas.map((cot) => {
          const esAprobada = cot.estado === 'aprobada';
          const esRechazada = cot.estado === 'rechazada';

          return (
            <div
              key={cot.id}
              id={`quote-card-${cot.id}`}
              className="bg-[#111111] rounded-2xl p-4 border border-[#1a1a1a] hover:border-[#c5a059]/40 hover:bg-[#131313] transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                
                {/* Header info */}
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    esAprobada 
                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' 
                      : esRechazada 
                        ? 'bg-rose-950/50 text-rose-400 border-rose-800/40' 
                        : 'bg-[#141414] text-[#c5a059] border-[#c5a059]/30'
                  }`}>
                    {esAprobada ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : esRechazada ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif italic font-bold text-base text-white">{cot.numero}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                        esAprobada 
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
                          : esRechazada 
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800/60' 
                            : 'bg-[#141414] text-[#c5a059] border-[#c5a059]/40'
                      }`}>
                        {cot.estado}
                      </span>
                    </div>

                    <h3 className="font-medium text-stone-200 text-xs mt-0.5">
                      {cot.clienteNombre}
                      {cot.empresa ? <span className="text-stone-400 font-normal"> • {cot.empresa}</span> : ''}
                    </h3>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Fecha: {formatearFecha(cot.fecha)} • Validez: {cot.validezDias} días
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a1a1a]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Total</span>
                  <span className="text-base sm:text-lg font-serif font-bold text-[#c5a059]">
                    {formatearMoneda(cot.total)}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {cot.items.length} {cot.items.length === 1 ? 'artículo' : 'artículos'}
                  </span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                
                {/* Status Switcher */}
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-stone-400 mr-1 hidden sm:inline">Cambiar:</span>
                  {cot.estado !== 'aprobada' && (
                    <button
                      onClick={() => onCambiarEstado(cot.id, 'aprobada')}
                      className="text-[11px] font-medium bg-emerald-950/40 hover:bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/50 transition-colors"
                    >
                      ✓ Aprobar
                    </button>
                  )}
                  {cot.estado !== 'pendiente' && (
                    <button
                      onClick={() => onCambiarEstado(cot.id, 'pendiente')}
                      className="text-[11px] font-medium bg-amber-950/40 hover:bg-amber-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-800/50 transition-colors"
                    >
                      ⏱ Pendiente
                    </button>
                  )}
                  {cot.estado !== 'rechazada' && (
                    <button
                      onClick={() => onCambiarEstado(cot.id, 'rechazada')}
                      className="text-[11px] font-medium bg-rose-950/40 hover:bg-rose-950 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-800/50 transition-colors"
                    >
                      ✕ Rechazar
                    </button>
                  )}
                </div>

                {/* View Details / PDF */}
                <button
                  id={`btn-ver-detalle-${cot.id}`}
                  onClick={() => onSeleccionarCotizacion(cot)}
                  className="inline-flex items-center space-x-1.5 bg-[#181818] hover:bg-[#c5a059] text-stone-300 hover:text-black border border-[#262626] hover:border-[#c5a059] text-xs font-medium px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Detalle y PDF</span>
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {cotizacionesFiltradas.length === 0 && (
        <div className="text-center py-12 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] p-6">
          <FileText className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-serif italic text-white mb-1">Sin resultados</h3>
          <p className="text-xs text-stone-400 mb-4">
            No se encontraron cotizaciones con el filtro actual "{filtroEstado}".
          </p>
          <button
            onClick={() => {
              setFiltroEstado('todas');
              setBusqueda('');
            }}
            className="bg-[#c5a059] text-black text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Ver todas las cotizaciones
          </button>
        </div>
      )}

    </div>
  );
};
