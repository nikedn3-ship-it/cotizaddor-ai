import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Bot, 
  Wrench, 
  Package, 
  Image as ImageIcon, 
  RefreshCw, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  FileText
} from 'lucide-react';
import { Articulo } from '../types';
import { formatearMoneda } from '../data/mockData';

interface ModalAgregarArticuloProps {
  abierto: boolean;
  onCerrar: () => void;
  categoriasExistentes: string[];
  onGuardarArticulo: (nuevoArticulo: Omit<Articulo, 'id'>) => Promise<Articulo | void>;
  onGuardarArticulosEnLote?: (nuevos: Omit<Articulo, 'id'>[]) => Promise<void>;
}

// Galería de imágenes temáticas sugeridas
const IMAGENES_SUGERIDAS = [
  { label: 'CCTV / Cámaras', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Redes / Switches', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80' },
  { label: 'Servidores / Rack', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80' },
  { label: 'Seguridad / Firewall', url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80' },
  { label: 'Laptops / Cómputo', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80' },
  { label: 'Discos / Storage', url: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80' },
  { label: 'Infraestructura Civil / EMT', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
  { label: 'Energía / Solar', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80' }
];

export const ModalAgregarArticulo: React.FC<ModalAgregarArticuloProps> = ({
  abierto,
  onCerrar,
  categoriasExistentes,
  onGuardarArticulo,
  onGuardarArticulosEnLote
}) => {
  const [modo, setModo] = useState<'ia' | 'manual'>('ia');
  const [guardando, setGuardando] = useState(false);
  const [exitoMensaje, setExitoMensaje] = useState<string | null>(null);

  // Estados Formulario Manual
  const [skuManual, setSkuManual] = useState('');
  const [nombreManual, setNombreManual] = useState('');
  const [categoriaManual, setCategoriaManual] = useState(categoriasExistentes.filter(c => c !== 'Todas')[0] || 'CCTV');
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState('');
  const [esNuevaCategoria, setEsNuevaCategoria] = useState(false);
  const [descripcionManual, setDescripcionManual] = useState('');
  const [precioManual, setPrecioManual] = useState<number | ''>(150);
  const [stockManual, setStockManual] = useState<number | ''>(20);
  const [unidadManual, setUnidadManual] = useState('unidad');
  const [imagenUrlManual, setImagenUrlManual] = useState(IMAGENES_SUGERIDAS[0].url);

  // Estados Asistente Mini Rey IA
  const [promptIA, setPromptIA] = useState('');
  const [cantidadIA, setCantidadIA] = useState<number>(2);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [articulosGenerados, setArticulosGenerados] = useState<Omit<Articulo, 'id'>[]>([]);

  if (!abierto) return null;

  const notificarExito = (msg: string) => {
    setExitoMensaje(msg);
    setTimeout(() => {
      setExitoMensaje(null);
      onCerrar();
    }, 2000);
  };

  const handleAutogenerarSku = () => {
    const cat = esNuevaCategoria ? categoriaPersonalizada : categoriaManual;
    const catPrefix = cat.slice(0, 3).toUpperCase() || 'IT';
    const nomPart = nombreManual.trim().split(' ')[0]?.slice(0, 4).toUpperCase() || 'GEN';
    const rand = Math.floor(100 + Math.random() * 900);
    setSkuManual(`${catPrefix}-${nomPart}-${rand}`);
  };

  const handleGuardarManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuManual.trim() || !nombreManual.trim() || precioManual === '') return;

    setGuardando(true);
    try {
      const catFinal = esNuevaCategoria && categoriaPersonalizada.trim() 
        ? categoriaPersonalizada.trim() 
        : categoriaManual;

      const nuevoArticulo: Omit<Articulo, 'id'> = {
        sku: skuManual.trim().toUpperCase(),
        nombre: nombreManual.trim(),
        descripcion: descripcionManual.trim() || 'Equipo de especificación profesional para proyectos de telecomunicaciones e ingeniería.',
        categoria: catFinal,
        precio: Number(precioManual),
        stock: Number(stockManual) || 0,
        unidad: unidadManual.trim() || 'unidad',
        imagenUrl: imagenUrlManual.trim()
      };

      await onGuardarArticulo(nuevoArticulo);
      notificarExito(`¡Artículo "${nuevoArticulo.nombre}" agregado con éxito al catálogo!`);
    } catch (err) {
      console.error('Error al guardar artículo manual:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleConsultarMiniRey = async () => {
    if (!promptIA.trim() || generandoIA) return;
    setGenerandoIA(true);

    try {
      const res = await fetch('/api/articulos/generar-con-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptIA.trim(),
          cantidad: cantidadIA
        })
      });

      if (!res.ok) throw new Error('Error al generar con IA');
      const data = await res.json();
      if (data.articulosGenerados && Array.isArray(data.articulosGenerados)) {
        setArticulosGenerados(data.articulosGenerados);
      }
    } catch (err) {
      console.error('Error generando con Mini Rey IA:', err);
    } finally {
      setGenerandoIA(false);
    }
  };

  const handleGuardarGeneradoIndividual = async (art: Omit<Articulo, 'id'>, index: number) => {
    setGuardando(true);
    try {
      await onGuardarArticulo(art);
      setArticulosGenerados(prev => prev.filter((_, idx) => idx !== index));
      notificarExito(`¡"${art.nombre}" agregado al catálogo oficial!`);
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarTodosLosGenerados = async () => {
    if (articulosGenerados.length === 0) return;
    setGuardando(true);

    try {
      if (onGuardarArticulosEnLote) {
        await onGuardarArticulosEnLote(articulosGenerados);
      } else {
        for (const art of articulosGenerados) {
          await onGuardarArticulo(art);
        }
      }
      notificarExito(`¡Se agregaron ${articulosGenerados.length} artículos generados al catálogo!`);
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Cabecera */}
        <div className="bg-[#141414] p-4 sm:p-5 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/60 flex items-center justify-center p-1 shadow-md">
              <Package className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <h2 className="font-serif italic text-base sm:text-lg font-bold text-white tracking-wide">
                Agregar Nuevos Artículos al Catálogo
              </h2>
              <p className="text-[11px] text-stone-400">
                INNMEX SOLUCIONES • Gestión de Inventario Oficial
              </p>
            </div>
          </div>

          <button
            onClick={onCerrar}
            className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de Éxito Flotante */}
        {exitoMensaje && (
          <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-800/80 px-4 py-2.5 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{exitoMensaje}</span>
          </div>
        )}

        {/* Selector de Modo: IA vs Manual */}
        <div className="bg-[#0a0a0a] px-4 py-2.5 border-b border-[#1a1a1a] flex space-x-2">
          <button
            type="button"
            onClick={() => setModo('ia')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              modo === 'ia'
                ? 'bg-[#181818] text-[#c5a059] border border-[#c5a059]/60 shadow'
                : 'text-stone-400 hover:text-white hover:bg-[#141414]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Generar con Mini Rey IA</span>
            <span className="bg-[#c5a059]/20 text-[#c5a059] text-[9px] px-1.5 py-0.2 rounded font-mono">IA</span>
          </button>

          <button
            type="button"
            onClick={() => setModo('manual')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              modo === 'manual'
                ? 'bg-[#181818] text-[#c5a059] border border-[#c5a059]/60 shadow'
                : 'text-stone-400 hover:text-white hover:bg-[#141414]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Carga Manual Tradicional</span>
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {/* MODO 1: GENERAR CON MINI REY IA */}
          {modo === 'ia' && (
            <div className="space-y-4">
              <div className="bg-[#141414] p-4 rounded-xl border border-[#c5a059]/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-serif font-bold text-white">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>Asistente Ingeniero Virtual 40 de INNMEX</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Describe qué equipos o tecnologías necesitas sumar al catálogo (marcas, modelos, tipos de cables, cámaras, conmutadores, racks o paneles solares). Mini Rey IA redactará la ficha técnica completa con SKU, precios de mercado B2B y fotos adecuadas.
                </p>
              </div>

              {/* Input de requerimiento */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-stone-300 font-bold block">
                  Requerimiento o Equipos a Generar:
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={promptIA}
                    onChange={(e) => setPromptIA(e.target.value)}
                    placeholder="Ej: Cámara PTZ IP 4K con Zoom 25x y visión láser 150m, o Kit de Fibra Óptica Monomodo con ODF y transceivers SFP..."
                    className="flex-1 bg-[#161616] text-white border border-[#262626] rounded-xl p-3 text-xs focus:border-[#c5a059] outline-none placeholder:text-stone-500 resize-none"
                  />
                </div>

                {/* Cantidad selector */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2 text-xs text-stone-400">
                    <span>Cantidad de fichas técnicas:</span>
                    <select
                      value={cantidadIA}
                      onChange={(e) => setCantidadIA(Number(e.target.value))}
                      className="bg-[#181818] text-white border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs outline-none"
                    >
                      <option value={1}>1 Artículo</option>
                      <option value={2}>2 Artículos (Recomendado)</option>
                      <option value={3}>3 Artículos (Familia/Kit)</option>
                      <option value={4}>4 Artículos</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleConsultarMiniRey}
                    disabled={!promptIA.trim() || generandoIA}
                    className="inline-flex items-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] disabled:bg-[#222] disabled:text-stone-500 text-black font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all"
                  >
                    {generandoIA ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analizando con Mini Rey...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generar Fichas Técnicas</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Chips rápidos de inspiración */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1.5">Sugerencias rápidas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Cámara PTZ Domo 360° Zoom 25x PoE+',
                      'Kit de Fibra Óptica 12 Hilos con ODF y SFP',
                      'Control de Acceso Facial y Chapa Magnética',
                      'Panel Solar 550W y Banco de Baterías 48V',
                      'Conmutador IP PBX Grandstream y Teléfonos SIP'
                    ].map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPromptIA(sug)}
                        className="text-[10px] bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 hover:text-white border border-[#222] hover:border-[#c5a059]/40 px-2 py-1 rounded-md transition-colors"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resultados Generados por Mini Rey IA */}
              {articulosGenerados.length > 0 && (
                <div className="pt-3 border-t border-[#1a1a1a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#c5a059] flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Fichas Generadas ({articulosGenerados.length})</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleGuardarTodosLosGenerados}
                      disabled={guardando}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow transition-all"
                    >
                      + Guardar Todos en Catálogo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {articulosGenerados.map((art, idx) => (
                      <div key={idx} className="bg-[#141414] p-3.5 rounded-xl border border-[#262626] flex flex-col sm:flex-row gap-3">
                        <div className="w-16 h-16 rounded-xl bg-black border border-[#c5a059]/40 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow">
                          <img
                            src={art.imagenUrl}
                            alt={art.nombre}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = IMAGENES_SUGERIDAS[0].url;
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[#c5a059] text-xs font-bold">{art.sku}</span>
                                <span className="bg-[#1f1f1f] text-stone-300 text-[10px] px-2 py-0.5 rounded font-medium border border-[#333]">
                                  {art.categoria}
                                </span>
                              </div>
                              <h4 className="text-xs font-semibold text-white mt-0.5">{art.nombre}</h4>
                            </div>
                            <span className="font-serif font-bold text-white text-sm whitespace-nowrap">
                              {formatearMoneda(art.precio)} <span className="text-[10px] font-sans font-normal text-stone-400">/{art.unidad}</span>
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-400 leading-snug line-clamp-2">
                            {art.descripcion}
                          </p>

                          <div className="pt-2 flex items-center justify-between text-[11px]">
                            <span className="text-stone-400 font-mono text-[10px]">Stock inicial: {art.stock} {art.unidad}</span>
                            <button
                              type="button"
                              onClick={() => handleGuardarGeneradoIndividual(art, idx)}
                              disabled={guardando}
                              className="inline-flex items-center space-x-1.5 bg-[#c5a059] hover:bg-[#d4b068] text-black font-semibold text-[11px] px-3 py-1 rounded-md transition-all"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Agregar al Catálogo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODO 2: CARGA MANUAL TRADICIONAL */}
          {modo === 'manual' && (
            <form onSubmit={handleGuardarManual} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* SKU */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase text-stone-300 font-bold">
                      SKU (Código único): *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutogenerarSku}
                      className="text-[10px] text-[#c5a059] hover:underline"
                    >
                      Autogenerar SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={skuManual}
                    onChange={(e) => setSkuManual(e.target.value.toUpperCase())}
                    placeholder="Ej: CAM-CCTV-4KIP"
                    className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs font-mono uppercase focus:border-[#c5a059] outline-none"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase text-stone-300 font-bold">
                      Categoría: *
                    </label>
                    <button
                      type="button"
                      onClick={() => setEsNuevaCategoria(!esNuevaCategoria)}
                      className="text-[10px] text-[#c5a059] hover:underline"
                    >
                      {esNuevaCategoria ? 'Elegir existente' : '+ Nueva categoría'}
                    </button>
                  </div>

                  {esNuevaCategoria ? (
                    <input
                      type="text"
                      required
                      value={categoriaPersonalizada}
                      onChange={(e) => setCategoriaPersonalizada(e.target.value)}
                      placeholder="Ej: Fibra Óptica, Domótica..."
                      className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                    />
                  ) : (
                    <select
                      value={categoriaManual}
                      onChange={(e) => setCategoriaManual(e.target.value)}
                      className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                    >
                      {categoriasExistentes.filter(c => c !== 'Todas').map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                      <option value="Fibra Óptica">Fibra Óptica</option>
                      <option value="Control de Acceso">Control de Acceso</option>
                      <option value="Telefonía IP">Telefonía IP</option>
                      <option value="Energía Solar">Energía Solar</option>
                    </select>
                  )}
                </div>

              </div>

              {/* Nombre del Artículo */}
              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block mb-1">
                  Nombre Completo del Artículo / Modelo: *
                </label>
                <input
                  type="text"
                  required
                  value={nombreManual}
                  onChange={(e) => setNombreManual(e.target.value)}
                  placeholder="Ej: Cámara Domo IP 4K 8MP PoE IR 50m con Analíticas de Cruce de Línea"
                  className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                />
              </div>

              {/* Precios, Stock y Unidad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block mb-1">
                    Precio Unitario (USD): *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={precioManual}
                    onChange={(e) => setPrecioManual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block mb-1">
                    Stock Disponible: *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockManual}
                    onChange={(e) => setStockManual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block mb-1">
                    Unidad de Medida: *
                  </label>
                  <select
                    value={unidadManual}
                    onChange={(e) => setUnidadManual(e.target.value)}
                    className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                  >
                    <option value="unidad">unidad</option>
                    <option value="bobina 305m">bobina 305m</option>
                    <option value="bobina 1000m">bobina 1000m</option>
                    <option value="tramo 3m">tramo 3m</option>
                    <option value="kit">kit</option>
                    <option value="metro">metro</option>
                    <option value="licencia/año">licencia/año</option>
                    <option value="jornada">jornada (servicio)</option>
                  </select>
                </div>
              </div>

              {/* Descripción Técnica */}
              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block mb-1">
                  Descripción Técnica de Ingeniería:
                </label>
                <textarea
                  rows={2}
                  value={descripcionManual}
                  onChange={(e) => setDescripcionManual(e.target.value)}
                  placeholder="Detalles sobre resolución, puertos PoE, carcasa metálica IP67, compresión H.265+, distancias y certificaciones..."
                  className="w-full bg-[#161616] text-white border border-[#262626] rounded-xl p-3 text-xs focus:border-[#c5a059] outline-none placeholder:text-stone-500 resize-none"
                />
              </div>

              {/* Selector de Imagen */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase text-stone-300 font-bold block">
                  Imagen del Producto:
                </label>
                
                {/* Galería rápida de imágenes sugeridas */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {IMAGENES_SUGERIDAS.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImagenUrlManual(img.url)}
                      title={img.label}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-black ${
                        imagenUrlManual === img.url
                          ? 'border-[#c5a059] scale-105 shadow-md'
                          : 'border-[#262626] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover rounded" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imagenUrlManual}
                    onChange={(e) => setImagenUrlManual(e.target.value)}
                    placeholder="O pega una URL personalizada (https://...)"
                    className="flex-1 bg-[#161616] text-white border border-[#262626] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none placeholder:text-stone-600 font-mono"
                  />
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onCerrar}
                  className="px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-stone-300 hover:text-white text-xs transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {guardando ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Guardando en ERP...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Guardar Artículo en Catálogo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
