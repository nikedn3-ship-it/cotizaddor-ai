import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Check, 
  ShoppingBag, 
  Package, 
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Articulo, ItemCotizacion } from '../types';
import { formatearMoneda } from '../data/mockData';
import { ModalAgregarArticulo } from './ModalAgregarArticulo';

interface PantallaBusquedaProps {
  articulos: Articulo[];
  carrito: ItemCotizacion[];
  onAgregarAlCarrito: (articulo: Articulo, cantidad?: number) => void;
  onGuardarArticulo?: (nuevoArticulo: Omit<Articulo, 'id'>) => Promise<Articulo | void>;
  onGuardarArticulosEnLote?: (nuevos: Omit<Articulo, 'id'>[]) => Promise<void>;
  onIrACotizacion: () => void;
  onAbrirCarrito: () => void;
}

export const PantallaBusqueda: React.FC<PantallaBusquedaProps> = ({
  articulos,
  carrito,
  onAgregarAlCarrito,
  onGuardarArticulo,
  onGuardarArticulosEnLote,
  onIrACotizacion,
  onAbrirCarrito
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');
  const [articuloDetalle, setArticuloDetalle] = useState<Articulo | null>(null);
  const [agregadoRecienteId, setAgregadoRecienteId] = useState<string | null>(null);
  const [modalNuevoArticuloAbierto, setModalNuevoArticuloAbierto] = useState(false);

  // Extract unique categories
  const categorias = useMemo(() => {
    const setCat = new Set<string>();
    articulos.forEach(a => setCat.add(a.categoria));
    return ['Todas', ...Array.from(setCat)];
  }, [articulos]);

  // Filtered articles
  const articulosFiltrados = useMemo(() => {
    return articulos.filter(item => {
      const coincideTexto = 
        item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        item.sku.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase());

      const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || item.categoria === categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });
  }, [articulos, terminoBusqueda, categoriaSeleccionada]);

  const handleAgregar = (articulo: Articulo) => {
    onAgregarAlCarrito(articulo, 1);
    setAgregadoRecienteId(articulo.id);
    setTimeout(() => {
      setAgregadoRecienteId(null);
    }, 1500);
  };

  const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header & Search Bar */}
      <div className="bg-[#0d0d0d] rounded-2xl p-4 border border-[#1a1a1a] sticky top-16 z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-serif italic text-white tracking-wide">Catálogo de Artículos</h1>
            <p className="text-xs text-stone-400">Búsqueda en tiempo real de inventario y precios</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Botón Principal para Agregar Artículos (Manual o Mini Rey IA) */}
            <button
              id="btn-abrir-modal-nuevo-articulo"
              onClick={() => setModalNuevoArticuloAbierto(true)}
              className="flex items-center space-x-1.5 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Agregar Artículo</span>
            </button>

            {/* Quick Cart Trigger */}
            {totalItemsCarrito > 0 && (
              <button
                onClick={onAbrirCarrito}
                className="flex items-center space-x-1.5 bg-[#141414] text-[#c5a059] border border-[#c5a059]/40 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-[#1a1a1a] transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{totalItemsCarrito} en carrito</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-busqueda-articulos"
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar por nombre, SKU (ej. C9200, DL380) o categoría..."
            className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-stone-400 outline-none transition-all shadow-inner"
          />
          {terminoBusqueda && (
            <button
              onClick={() => setTerminoBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {categorias.map((cat) => {
            const isSelected = categoriaSeleccionada === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#c5a059] text-black font-semibold'
                    : 'bg-[#141414] text-stone-400 hover:text-white border border-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1 text-xs text-stone-400">
        <span>Mostrando {articulosFiltrados.length} artículos encontrados</span>
        {terminoBusqueda && (
          <span className="text-[#c5a059] font-medium">Filtrado por: "{terminoBusqueda}"</span>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {articulosFiltrados.map((articulo) => {
          const itemEnCarrito = carrito.find(c => c.articuloId === articulo.id);
          const fueAgregado = agregadoRecienteId === articulo.id;

          return (
            <div
              key={articulo.id}
              id={`card-articulo-${articulo.id}`}
              className="bg-[#111111] rounded-2xl p-4 border border-[#1a1a1a] hover:border-[#c5a059]/40 hover:bg-[#131313] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with SKU & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#c5a059] bg-[#1a1a1a] border border-[#c5a059]/30 px-2 py-0.5 rounded">
                    {articulo.sku}
                  </span>
                  <span className="text-[10px] font-medium text-stone-400 bg-[#171717] border border-[#222222] px-2 py-0.5 rounded-full">
                    {articulo.categoria}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-medium text-white text-sm leading-snug mb-1 line-clamp-2">
                  {articulo.nombre}
                </h3>

                {/* Description */}
                <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">
                  {articulo.descripcion}
                </p>
              </div>

              <div>
                {/* Stock & Unit */}
                <div className="flex items-center justify-between text-xs text-stone-400 mb-3 pt-2 border-t border-[#1a1a1a]">
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-2 h-2 rounded-full ${articulo.stock > 5 ? 'bg-[#c5a059]' : 'bg-amber-500'}`} />
                    <span className="font-medium text-stone-300">Stock: {articulo.stock} {articulo.unidad}s</span>
                  </div>
                  <button
                    onClick={() => setArticuloDetalle(articulo)}
                    className="text-stone-400 hover:text-[#c5a059] p-1 transition-colors"
                    title="Ver ficha técnica"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block leading-none">Precio</span>
                    <span className="text-base font-serif font-bold text-[#c5a059]">
                      {formatearMoneda(articulo.precio)}
                    </span>
                  </div>

                  <button
                    id={`btn-add-${articulo.id}`}
                    onClick={() => handleAgregar(articulo)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      fueAgregado
                        ? 'bg-emerald-600 text-white scale-95'
                        : itemEnCarrito
                          ? 'bg-[#c5a059]/20 text-[#c5a059] hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/50'
                          : 'bg-[#181818] hover:bg-[#c5a059] text-stone-300 hover:text-black border border-[#262626] hover:border-[#c5a059]'
                    }`}
                  >
                    {fueAgregado ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Agregado!</span>
                      </>
                    ) : itemEnCarrito ? (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>({itemEnCarrito.cantidad}) Más</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {articulosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] p-6">
          <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-serif italic text-white mb-1">No se encontraron artículos</h3>
          <p className="text-xs text-stone-400 mb-4 max-w-sm mx-auto">
            Prueba ajustando los términos de búsqueda o seleccionando la categoría "Todas".
          </p>
          <button
            onClick={() => {
              setTerminoBusqueda('');
              setCategoriaSeleccionada('Todas');
            }}
            className="bg-[#c5a059] text-black text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Floating Bottom Action Banner if items in cart */}
      {totalItemsCarrito > 0 && (
        <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 max-w-xl mx-auto z-20 no-print">
          <div className="bg-[#0d0d0d] text-white p-3.5 rounded-2xl shadow-2xl border border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center font-bold text-sm">
                {totalItemsCarrito}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Carrito de Cotización Activo</p>
                <p className="text-[11px] text-stone-400">
                  {carrito.length} artículos listos para presupuesto
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onAbrirCarrito}
                className="bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 hover:text-white border border-[#1a1a1a] text-xs font-medium px-3 py-2 rounded-xl"
              >
                Ver
              </button>
              <button
                id="btn-flotante-ir-cotizacion"
                onClick={onIrACotizacion}
                className="bg-[#c5a059] hover:bg-[#d4b068] text-black text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1 shadow-md"
              >
                <span>Cotizar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Artículo */}
      {articuloDetalle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0d0d0d] text-[#e0e0e0] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#1a1a1a] relative">
            <button
              onClick={() => setArticuloDetalle(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <span className="font-mono text-xs font-bold bg-[#141414] text-[#c5a059] border border-[#c5a059]/30 px-2.5 py-1 rounded">
                {articuloDetalle.sku}
              </span>
              <span className="text-xs font-medium text-stone-300 bg-[#171717] border border-[#222] px-2.5 py-1 rounded-full">
                {articuloDetalle.categoria}
              </span>
            </div>

            <h3 className="text-base font-serif italic text-white mb-2">
              {articuloDetalle.nombre}
            </h3>

            <p className="text-xs text-stone-300 mb-4 leading-relaxed bg-[#111111] p-3 rounded-xl border border-[#1a1a1a]">
              {articuloDetalle.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-[#111111] p-2.5 rounded-xl border border-[#1a1a1a]">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-mono">Stock Disponible</span>
                <span className="font-bold text-white text-sm">{articuloDetalle.stock} {articuloDetalle.unidad}s</span>
              </div>
              <div className="bg-[#111111] p-2.5 rounded-xl border border-[#1a1a1a]">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider font-mono">Precio Catálogo</span>
                <span className="font-serif font-bold text-[#c5a059] text-sm">{formatearMoneda(articuloDetalle.precio)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setArticuloDetalle(null)}
                className="flex-1 py-2.5 text-xs font-medium text-stone-300 bg-[#141414] hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleAgregar(articuloDetalle);
                  setArticuloDetalle(null);
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#d4b068] rounded-xl flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal para Agregar Nuevos Artículos (Manual o Mini Rey IA) */}
      {onGuardarArticulo && (
        <ModalAgregarArticulo
          abierto={modalNuevoArticuloAbierto}
          onCerrar={() => setModalNuevoArticuloAbierto(false)}
          categoriasExistentes={categorias}
          onGuardarArticulo={onGuardarArticulo}
          onGuardarArticulosEnLote={onGuardarArticulosEnLote}
        />
      )}

    </div>
  );
};
