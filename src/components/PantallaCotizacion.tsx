import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Trash2, 
  Plus, 
  Minus, 
  DollarSign, 
  Save, 
  FileCheck, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  Percent, 
  Sparkles, 
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Articulo, ItemCotizacion, Cotizacion } from '../types';
import { formatearMoneda } from '../data/mockData';

interface PantallaCotizacionProps {
  articulos: Articulo[];
  carrito: ItemCotizacion[];
  setCarrito: React.Dispatch<React.SetStateAction<ItemCotizacion[]>>;
  onGuardarCotizacion: (cot: Omit<Cotizacion, 'id' | 'numero' | 'creadoEn'>) => void;
  onIrABusqueda: () => void;
}

export const PantallaCotizacion: React.FC<PantallaCotizacionProps> = ({
  articulos,
  carrito,
  setCarrito,
  onGuardarCotizacion,
  onIrABusqueda
}) => {
  // Client info state
  const [clienteNombre, setClienteNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [validezDias, setValidezDias] = useState<number>(15);
  const [observaciones, setObservaciones] = useState('');
  
  // Global discount
  const [descuentoGlobalPorcentaje, setDescuentoGlobalPorcentaje] = useState<number>(0);
  const [tasaIva, setTasaIva] = useState<number>(0.16); // 16% IVA

  // Quick article selector dropdown
  const [articuloSeleccionadoId, setArticuloSeleccionadoId] = useState('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  // Update item quantity
  const handleCambiarCantidad = (articuloId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      handleEliminarItem(articuloId);
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

  // Update item discount %
  const handleCambiarDescuentoItem = (articuloId: string, descuento: number) => {
    const dVal = Math.min(Math.max(descuento, 0), 100);
    setCarrito(prev => prev.map(item => {
      if (item.articuloId === articuloId) {
        const subtotal = item.precioUnitario * item.cantidad * (1 - dVal / 100);
        return { ...item, descuentoPorcentaje: dVal, subtotal };
      }
      return item;
    }));
  };

  // Remove item
  const handleEliminarItem = (articuloId: string) => {
    setCarrito(prev => prev.filter(item => item.articuloId !== articuloId));
  };

  // Add article from quick dropdown
  const handleAgregarArticuloRapido = () => {
    if (!articuloSeleccionadoId) return;
    const art = articulos.find(a => a.id === articuloSeleccionadoId);
    if (!art) return;

    setCarrito(prev => {
      const existe = prev.find(item => item.articuloId === art.id);
      if (existe) {
        return prev.map(item => {
          if (item.articuloId === art.id) {
            const nuevaCant = item.cantidad + 1;
            const subtotal = item.precioUnitario * nuevaCant * (1 - item.descuentoPorcentaje / 100);
            return { ...item, cantidad: nuevaCant, subtotal };
          }
          return item;
        });
      }
      return [
        ...prev,
        {
          articuloId: art.id,
          sku: art.sku,
          nombre: art.nombre,
          precioUnitario: art.precio,
          cantidad: 1,
          descuentoPorcentaje: 0,
          subtotal: art.precio,
          imagenUrl: art.imagenUrl
        }
      ];
    });

    setArticuloSeleccionadoId('');
  };

  // Totals calculations
  const subtotalBruto = carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  const sumaDescuentosPorItem = carrito.reduce((acc, item) => {
    return acc + (item.precioUnitario * item.cantidad * (item.descuentoPorcentaje / 100));
  }, 0);

  const baseConDescuentoItem = subtotalBruto - sumaDescuentosPorItem;
  const montoDescuentoGlobal = baseConDescuentoItem * (descuentoGlobalPorcentaje / 100);
  const montoDescuentoTotal = sumaDescuentosPorItem + montoDescuentoGlobal;
  const subtotalNeto = Math.max(0, subtotalBruto - montoDescuentoTotal);
  const montoIva = subtotalNeto * tasaIva;
  const totalGeneral = subtotalNeto + montoIva;

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    if (!clienteNombre.trim()) {
      setErrorValidacion('Por favor ingresa el nombre del cliente o contacto.');
      return;
    }

    if (carrito.length === 0) {
      setErrorValidacion('Debes agregar al menos 1 artículo a la cotización.');
      return;
    }

    onGuardarCotizacion({
      fecha: new Date().toISOString().split('T')[0],
      clienteNombre: clienteNombre.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      documentoIdentidad: documentoIdentidad.trim(),
      items: carrito,
      subtotalBruto,
      descuentoGlobalPorcentaje,
      montoDescuento: montoDescuentoTotal,
      subtotalNeto,
      tasaIva,
      montoIva,
      total: totalGeneral,
      estado: 'pendiente',
      observaciones: observaciones.trim(),
      validezDias
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      
      {/* Title */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#c5a059] bg-[#141414] border border-[#c5a059]/40 px-2.5 py-1 rounded-full mb-1">
              <FileText className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Formulario Odoo Estilo ERP</span>
            </div>
            <h1 className="text-xl font-serif italic text-white tracking-wide">Nueva Cotización</h1>
            <p className="text-xs text-stone-400">Ingresa los datos del cliente, selecciona los ítems y calcula el total</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">Total Estimado</span>
            <span className="text-xl font-serif font-bold text-[#c5a059]">
              {formatearMoneda(totalGeneral)}
            </span>
          </div>
        </div>

        {errorValidacion && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorValidacion}</span>
          </div>
        )}
      </div>

      {/* 1. Client Information */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a] space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
          <User className="w-4 h-4 text-[#c5a059]" />
          <span>1. Información del Cliente</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Nombre del Cliente *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-cliente-nombre"
                type="text"
                required
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                placeholder="Ej. Ing. Carlos Morales"
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Empresa / Razón Social
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-cliente-empresa"
                type="text"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ej. Constructora del Norte S.A."
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-cliente-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cmorales@empresa.com"
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Teléfono de Contacto
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-cliente-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              RFC / RUT / Documento Fiscal
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-cliente-rfc"
                type="text"
                value={documentoIdentidad}
                onChange={(e) => setDocumentoIdentidad(e.target.value)}
                placeholder="RFC / CIF / NIT"
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-none transition-all uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Validez de Oferta (Días)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                id="select-validez-dias"
                value={validezDias}
                onChange={(e) => setValidezDias(Number(e.target.value))}
                className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none transition-all"
              >
                <option value={7}>7 días naturales</option>
                <option value={15}>15 días naturales (Estándar)</option>
                <option value={30}>30 días naturales</option>
                <option value={60}>60 días naturales</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Items Table & Quick Add */}
      <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-stone-300 flex items-center space-x-1.5">
            <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
            <span>2. Líneas de la Cotización ({carrito.length})</span>
          </h2>

          <button
            type="button"
            onClick={onIrABusqueda}
            className="text-xs font-medium text-[#c5a059] hover:text-[#d4b068] flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Explorar Catálogo</span>
          </button>
        </div>

        {/* Quick Dropdown Add */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 pb-2">
          <select
            id="select-articulo-rapido"
            value={articuloSeleccionadoId}
            onChange={(e) => setArticuloSeleccionadoId(e.target.value)}
            className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c5a059]/60"
          >
            <option value="">-- Seleccionar artículo para agregar rápido --</option>
            {articulos.map(a => (
              <option key={a.id} value={a.id}>
                {a.sku} - {a.nombre} ({formatearMoneda(a.precio)}) - Stock: {a.stock}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAgregarArticuloRapido}
            disabled={!articuloSeleccionadoId}
            className="bg-[#181818] hover:bg-[#c5a059] disabled:opacity-50 text-stone-300 hover:text-black border border-[#222222] text-xs font-medium px-4 py-2 rounded-xl flex items-center justify-center space-x-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar</span>
          </button>
        </div>

        {/* Items List */}
        {carrito.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#1a1a1a] rounded-xl p-4 bg-[#111111]/40">
            <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto mb-2" />
            <p className="text-xs font-medium text-stone-400 mb-2">No hay artículos agregados en esta cotización</p>
            <button
              type="button"
              onClick={onIrABusqueda}
              className="bg-[#c5a059] hover:bg-[#d4b068] text-black text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1"
            >
              <span>Abrir Catálogo de Artículos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {carrito.map((item) => (
              <div key={item.articuloId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold bg-[#141414] text-[#c5a059] border border-[#c5a059]/30 px-1.5 py-0.5 rounded">
                      {item.sku}
                    </span>
                    <span className="font-medium text-xs text-white">{item.nombre}</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Precio unitario: {formatearMoneda(item.precioUnitario)}
                  </div>
                </div>

                {/* Quantity & Discount Controls */}
                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  
                  {/* Quantity */}
                  <div className="flex items-center space-x-1 bg-[#141414] border border-[#1a1a1a] rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => handleCambiarCantidad(item.articuloId, item.cantidad - 1)}
                      className="w-6 h-6 rounded bg-[#1a1a1a] text-stone-300 hover:text-[#c5a059] flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCambiarCantidad(item.articuloId, item.cantidad + 1)}
                      className="w-6 h-6 rounded bg-[#1a1a1a] text-stone-300 hover:text-[#c5a059] flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Discount input */}
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-stone-400">Desc:</span>
                    <div className="relative w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.descuentoPorcentaje || ''}
                        onChange={(e) => handleCambiarDescuentoItem(item.articuloId, Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-[#111111] border border-[#1a1a1a] rounded-lg px-2 py-1 text-right text-xs font-medium text-white outline-none pr-5 focus:border-[#c5a059]/60"
                      />
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">%</span>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-xs font-serif font-bold text-[#c5a059] block">
                      {formatearMoneda(item.subtotal)}
                    </span>
                    {item.descuentoPorcentaje > 0 && (
                      <span className="text-[10px] text-emerald-400 font-medium block">
                        -{item.descuentoPorcentaje}% aplic.
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleEliminarItem(item.articuloId)}
                    className="text-stone-400 hover:text-rose-400 p-1 transition-colors"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Global Discounts & Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Observaciones & Condiciones */}
        <div className="bg-[#0d0d0d] rounded-2xl p-5 border border-[#1a1a1a] space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-300">
            Observaciones y Términos Comerciales
          </label>
          <textarea
            id="textarea-observaciones"
            rows={4}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Especificaciones de entrega, garantía, método de pago, condiciones..."
            className="w-full bg-[#111111] border border-[#1a1a1a] focus:border-[#c5a059]/60 focus:bg-[#141414] rounded-xl p-3 text-xs text-white placeholder-stone-500 outline-none transition-all leading-relaxed"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-stone-400 self-center">Insertar nota rápida:</span>
            <button
              type="button"
              onClick={() => setObservaciones(prev => `${prev ? prev + ' ' : ''}Garantía de 1 año con reemplazo directo y soporte técnico incluido.`)}
              className="text-[10px] bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] px-2 py-0.5 rounded-md transition-colors"
            >
              + Garantía 1 año
            </button>
            <button
              type="button"
              onClick={() => setObservaciones(prev => `${prev ? prev + ' ' : ''}Condición de pago: 50% anticipo y 50% contra entrega satisfactoria.`)}
              className="text-[10px] bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] px-2 py-0.5 rounded-md transition-colors"
            >
              + Pago 50/50
            </button>
            <button
              type="button"
              onClick={() => setObservaciones(prev => `${prev ? prev + ' ' : ''}Tiempo estimado de entrega: 3 a 5 días hábiles en sitio del cliente.`)}
              className="text-[10px] bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 border border-[#1a1a1a] px-2 py-0.5 rounded-md transition-colors"
            >
              + Entrega 3-5 días
            </button>
          </div>
        </div>

        {/* Live Financial Breakdown */}
        <div className="bg-[#0d0d0d] text-white rounded-2xl p-5 border border-[#1a1a1a] space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-300">
            Resumen Financiero en Vivo
          </h3>

          <div className="space-y-2 text-xs pt-1">
            
            <div className="flex justify-between text-stone-400">
              <span>Subtotal Bruto:</span>
              <span className="font-semibold text-white">{formatearMoneda(subtotalBruto)}</span>
            </div>

            {/* Global Discount Input */}
            <div className="flex items-center justify-between text-stone-400 pt-1 border-t border-[#1a1a1a]">
              <div className="flex items-center space-x-1.5">
                <span>Descuento Global:</span>
                <div className="relative w-16">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={descuentoGlobalPorcentaje || ''}
                    onChange={(e) => setDescuentoGlobalPorcentaje(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-[#111111] border border-[#1a1a1a] rounded px-2 py-0.5 text-right text-xs font-bold text-white outline-none pr-4 focus:border-[#c5a059]/60"
                  />
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-stone-400">%</span>
                </div>
              </div>
              <span className="font-semibold text-rose-400">
                -{formatearMoneda(montoDescuentoTotal)}
              </span>
            </div>

            <div className="flex justify-between text-stone-400">
              <span>Subtotal Neto:</span>
              <span className="font-semibold text-white">{formatearMoneda(subtotalNeto)}</span>
            </div>

            {/* Tax selector */}
            <div className="flex items-center justify-between text-stone-400">
              <div className="flex items-center space-x-1.5">
                <span>IVA:</span>
                <select
                  value={tasaIva}
                  onChange={(e) => setTasaIva(Number(e.target.value))}
                  className="bg-[#111111] border border-[#1a1a1a] rounded px-1.5 py-0.5 text-[11px] text-white outline-none focus:border-[#c5a059]/60"
                >
                  <option value={0.16}>16% (Estándar)</option>
                  <option value={0.08}>8% (Frontera)</option>
                  <option value={0}>0% (Exento)</option>
                </select>
              </div>
              <span className="font-semibold text-white">{formatearMoneda(montoIva)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-[#1a1a1a] text-base sm:text-lg">
              <span className="font-mono text-xs uppercase tracking-wider text-stone-300">TOTAL A FACTURAR:</span>
              <span className="font-serif font-bold text-[#c5a059] text-2xl">
                {formatearMoneda(totalGeneral)}
              </span>
            </div>

          </div>

          <div className="pt-3">
            <button
              id="btn-guardar-cotizacion-final"
              type="submit"
              disabled={carrito.length === 0}
              className="w-full bg-[#c5a059] hover:bg-[#d4b068] disabled:opacity-50 text-black font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#c5a059]/10 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>Guardar y Generar PDF</span>
            </button>
          </div>

        </div>

      </div>

    </form>
  );
};
