import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { ItemCotizacion } from '../types';
import { formatearMoneda } from '../data/mockData';

interface ModalCarritoProps {
  abierto: boolean;
  onCerrar: () => void;
  carrito: ItemCotizacion[];
  setCarrito: React.Dispatch<React.SetStateAction<ItemCotizacion[]>>;
  onIrACotizar: () => void;
}

export const ModalCarrito: React.FC<ModalCarritoProps> = ({
  abierto,
  onCerrar,
  carrito,
  setCarrito,
  onIrACotizar
}) => {
  if (!abierto) return null;

  const handleCambiarCantidad = (articuloId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      setCarrito(prev => prev.filter(i => i.articuloId !== articuloId));
      return;
    }
    setCarrito(prev => prev.map(item => {
      if (item.articuloId === articuloId) {
        const subtotal = item.precioUnitario * nuevaCantidad * (1 - item.descuentoPorcentaje / 100);
        return { ...item, cantidad: nuevaCantidad, subtotal };
      }
      return item;
    }));
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-end z-50 animate-fade-in no-print">
      <div className="bg-[#0d0d0d] border-l border-[#1a1a1a] text-[#e0e0e0] w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h2 className="font-serif italic font-bold text-base text-white">Carrito de Cotización ({carrito.length})</h2>
          </div>
          <button
            onClick={onCerrar}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]">
          {carrito.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-stone-700 mx-auto mb-3" />
              <p className="font-serif italic text-sm text-stone-300">El carrito está vacío</p>
              <p className="text-xs text-stone-500 mt-1">Explora el catálogo de artículos y agrega productos para presupuestar.</p>
            </div>
          ) : (
            carrito.map(item => (
              <div
                key={item.articuloId}
                className="bg-[#111111] p-3 rounded-xl border border-[#1a1a1a] flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] font-bold bg-[#1a1a1a] text-[#c5a059] px-1.5 py-0.5 rounded border border-[#262626]">
                    {item.sku}
                  </span>
                  <h4 className="font-medium text-xs text-stone-200 truncate mt-1">{item.nombre}</h4>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {formatearMoneda(item.precioUnitario)} c/u
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-[#1a1a1a] rounded-lg border border-[#262626] p-0.5">
                    <button
                      onClick={() => handleCambiarCantidad(item.articuloId, item.cantidad - 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-[#c5a059]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-bold text-white">{item.cantidad}</span>
                    <button
                      onClick={() => handleCambiarCantidad(item.articuloId, item.cantidad + 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-[#c5a059]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[65px]">
                    <span className="text-xs font-serif font-bold text-[#c5a059] block">
                      {formatearMoneda(item.subtotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCambiarCantidad(item.articuloId, 0)}
                    className="text-stone-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {carrito.length > 0 && (
          <div className="p-4 border-t border-[#1a1a1a] bg-[#111111] space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono uppercase text-stone-400 tracking-wider">Subtotal Estimado:</span>
              <span className="text-lg font-serif font-bold text-[#c5a059]">
                {formatearMoneda(totalCarrito)}
              </span>
            </div>

            <button
              id="btn-carrito-ir-cotizar"
              onClick={() => {
                onCerrar();
                onIrACotizar();
              }}
              className="w-full bg-[#c5a059] hover:bg-[#d4b068] text-black font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <span>Proceder a Cotización</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
