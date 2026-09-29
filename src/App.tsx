import React, { useState, useEffect, useMemo } from 'react';
import { Articulo, Cotizacion, ItemCotizacion, EstadoCotizacion, Estadisticas } from './types';
import { MOCK_ARTICULOS, MOCK_COTIZACIONES, MOCK_ESTADISTICAS } from './data/mockData';

import { NavbarHeader } from './components/NavbarHeader';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidBottomNav } from './components/AndroidBottomNav';

import { PantallaInicio } from './components/PantallaInicio';
import { PantallaBusqueda } from './components/PantallaBusqueda';
import { PantallaCotizacion } from './components/PantallaCotizacion';
import { PantallaHistorial } from './components/PantallaHistorial';
import { PantallaDetalleCotizacion } from './components/PantallaDetalleCotizacion';
import { PantallaChatIA } from './components/PantallaChatIA';

import { ModalCarrito } from './components/ModalCarrito';
import { ModalArchivosAPK } from './components/ModalArchivosAPK';

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<string>('inicio');
  const [modoVista, setModoVista] = useState<'android' | 'desktop'>('desktop');
  
  const [articulos, setArticulos] = useState<Articulo[]>(MOCK_ARTICULOS);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(MOCK_COTIZACIONES);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<Cotizacion | null>(MOCK_COTIZACIONES[0]);
  
  const [carrito, setCarrito] = useState<ItemCotizacion[]>([]);
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);
  const [modalArchivosAbierto, setModalArchivosAbierto] = useState(false);

  // Sync data with backend API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resArticulos, resCotizaciones] = await Promise.all([
          fetch('/api/articulos'),
          fetch('/api/cotizaciones')
        ]);

        if (resArticulos.ok) {
          const dataA = await resArticulos.json();
          if (dataA.articulos && dataA.articulos.length > 0) {
            setArticulos(dataA.articulos);
          }
        }

        if (resCotizaciones.ok) {
          const dataC = await resCotizaciones.json();
          if (dataC.cotizaciones && dataC.cotizaciones.length > 0) {
            setCotizaciones(dataC.cotizaciones);
            setCotizacionSeleccionada(dataC.cotizaciones[0]);
          }
        }
      } catch (err) {
        console.warn('Usando datos de catálogo en memoria local:', err);
      }
    };

    cargarDatos();
  }, []);

  // Live Statistics calculation
  const estadisticas: Estadisticas = useMemo(() => {
    const totalArticulos = articulos.length;
    const totalCotizaciones = cotizaciones.length;
    const totalMonto = cotizaciones.reduce((acc, c) => acc + c.total, 0);
    const cotizacionesAprobadas = cotizaciones.filter(c => c.estado === 'aprobada').length;
    const cotizacionesPendientes = cotizaciones.filter(c => c.estado === 'pendiente').length;
    const cotizacionesRechazadas = cotizaciones.filter(c => c.estado === 'rechazada').length;
    const tasaAprobacion = totalCotizaciones > 0 ? Math.round((cotizacionesAprobadas / totalCotizaciones) * 100) : 0;
    const ticketPromedio = totalCotizaciones > 0 ? totalMonto / totalCotizaciones : 0;

    return {
      totalArticulos,
      totalCotizaciones,
      totalMonto,
      cotizacionesAprobadas,
      cotizacionesPendientes,
      cotizacionesRechazadas,
      tasaAprobacion,
      ticketPromedio
    };
  }, [articulos, cotizaciones]);

  // Cart actions
  const handleAgregarAlCarrito = (articulo: Articulo, cantidad: number = 1) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.articuloId === articulo.id);
      if (existe) {
        return prev.map(item => {
          if (item.articuloId === articulo.id) {
            const nuevaCant = item.cantidad + cantidad;
            const subtotal = item.precioUnitario * nuevaCant * (1 - item.descuentoPorcentaje / 100);
            return { ...item, cantidad: nuevaCant, subtotal };
          }
          return item;
        });
      }

      return [
        ...prev,
        {
          articuloId: articulo.id,
          sku: articulo.sku,
          nombre: articulo.nombre,
          precioUnitario: articulo.precio,
          cantidad,
          descuentoPorcentaje: 0,
          subtotal: articulo.precio * cantidad,
          imagenUrl: articulo.imagenUrl
        }
      ];
    });
  };

  // Add single article to catalog
  const handleGuardarArticulo = async (nuevoArticulo: Omit<Articulo, 'id'>): Promise<Articulo | void> => {
    try {
      const res = await fetch('/api/articulos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoArticulo)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.articulo) {
          setArticulos(prev => [data.articulo, ...prev]);
          return data.articulo;
        }
      }
    } catch (e) {
      console.warn('Fallback al guardar articulo localmente:', e);
    }

    const artLocal: Articulo = {
      ...nuevoArticulo,
      id: `art-${Date.now()}`
    };
    setArticulos(prev => [artLocal, ...prev]);
    return artLocal;
  };

  // Add multiple articles in bulk
  const handleGuardarArticulosEnLote = async (nuevos: Omit<Articulo, 'id'>[]): Promise<void> => {
    try {
      const res = await fetch('/api/articulos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articulos: nuevos })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.articulos && data.articulos.length > 0) {
          setArticulos(prev => [...data.articulos, ...prev]);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback guardando lote localmente:', e);
    }

    const creados: Articulo[] = nuevos.map((n, i) => ({
      ...n,
      id: `art-${Date.now()}-${i}`
    }));
    setArticulos(prev => [...creados, ...prev]);
  };

  // Create Quote Action
  const handleGuardarCotizacion = async (data: Omit<Cotizacion, 'id' | 'numero' | 'creadoEn'>) => {
    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const resJson = await response.json();
        const nueva = resJson.cotizacion;
        setCotizaciones(prev => [nueva, ...prev]);
        setCotizacionSeleccionada(nueva);
        setCarrito([]); // Clean cart
        setPantallaActual('detalle');
        return;
      }
    } catch (err) {
      console.warn('Fallback al guardar cotización localmente:', err);
    }

    // Local fallback if offline
    const nextNumber = String(cotizaciones.length + 1).padStart(3, '0');
    const nuevaLocal: Cotizacion = {
      ...data,
      id: `cot-${Date.now()}`,
      numero: `COT-2024-${nextNumber}`,
      creadoEn: new Date().toISOString()
    };

    setCotizaciones(prev => [nuevaLocal, ...prev]);
    setCotizacionSeleccionada(nuevaLocal);
    setCarrito([]);
    setPantallaActual('detalle');
  };

  // Change quote status
  const handleCambiarEstado = async (id: string, nuevoEstado: EstadoCotizacion) => {
    try {
      await fetch(`/api/cotizaciones/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (e) {
      console.warn('Actualizando estado en memoria:', e);
    }

    setCotizaciones(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, estado: nuevoEstado };
      }
      return c;
    }));

    if (cotizacionSeleccionada && cotizacionSeleccionada.id === id) {
      setCotizacionSeleccionada(prev => prev ? { ...prev, estado: nuevoEstado } : null);
    }
  };

  const handleSeleccionarCotizacion = (cot: Cotizacion) => {
    setCotizacionSeleccionada(cot);
    setPantallaActual('detalle');
  };

  const totalItemsEnCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-[#e0e0e0] antialiased selection:bg-[#c5a059]/30 selection:text-white">
      
      {/* Top Navbar */}
      <NavbarHeader
        pantallaActual={pantallaActual}
        setPantallaActual={setPantallaActual}
        modoVista={modoVista}
        setModoVista={setModoVista}
        cantidadCarrito={totalItemsEnCarrito}
        onAbrirCarrito={() => setModalCarritoAbierto(true)}
        onAbrirArchivos={() => setModalArchivosAbierto(true)}
      />

      {/* Main Content inside Android Frame or Desktop View */}
      <div className="flex-1 flex flex-col">
        <AndroidFrame modoVista={modoVista} setModoVista={setModoVista}>
          {pantallaActual === 'inicio' && (
            <PantallaInicio
              articulos={articulos}
              cotizaciones={cotizaciones}
              estadisticas={estadisticas}
              setPantallaActual={setPantallaActual}
              onSeleccionarCotizacion={handleSeleccionarCotizacion}
              onAbrirArchivos={() => setModalArchivosAbierto(true)}
            />
          )}

          {pantallaActual === 'busqueda' && (
            <PantallaBusqueda
              articulos={articulos}
              carrito={carrito}
              onAgregarAlCarrito={handleAgregarAlCarrito}
              onGuardarArticulo={handleGuardarArticulo}
              onGuardarArticulosEnLote={handleGuardarArticulosEnLote}
              onIrACotizacion={() => setPantallaActual('cotizacion')}
              onAbrirCarrito={() => setModalCarritoAbierto(true)}
            />
          )}

          {pantallaActual === 'cotizacion' && (
            <PantallaCotizacion
              articulos={articulos}
              carrito={carrito}
              setCarrito={setCarrito}
              onGuardarCotizacion={handleGuardarCotizacion}
              onIrABusqueda={() => setPantallaActual('busqueda')}
            />
          )}

          {pantallaActual === 'historial' && (
            <PantallaHistorial
              cotizaciones={cotizaciones}
              onSeleccionarCotizacion={handleSeleccionarCotizacion}
              onCambiarEstado={handleCambiarEstado}
              onNuevaCotizacion={() => setPantallaActual('cotizacion')}
            />
          )}

          {pantallaActual === 'detalle' && cotizacionSeleccionada && (
            <PantallaDetalleCotizacion
              cotizacion={cotizacionSeleccionada}
              articulos={articulos}
              onVolver={() => setPantallaActual('historial')}
              onCambiarEstado={handleCambiarEstado}
            />
          )}

          {pantallaActual === 'ia' && (
            <PantallaChatIA
              articulos={articulos}
              carrito={carrito}
              onAgregarAlCarrito={handleAgregarAlCarrito}
              onGuardarArticulo={handleGuardarArticulo}
              onGuardarArticulosEnLote={handleGuardarArticulosEnLote}
              onAbrirCarrito={() => setModalCarritoAbierto(true)}
              onIrABusqueda={() => setPantallaActual('busqueda')}
              onIrACotizacion={() => setPantallaActual('cotizacion')}
            />
          )}
        </AndroidFrame>
      </div>

      {/* Bottom Navigation Bar */}
      <AndroidBottomNav
        pantallaActual={pantallaActual}
        setPantallaActual={setPantallaActual}
        cantidadCarrito={totalItemsEnCarrito}
      />

      {/* Shopping Cart Drawer */}
      <ModalCarrito
        abierto={modalCarritoAbierto}
        onCerrar={() => setModalCarritoAbierto(false)}
        carrito={carrito}
        setCarrito={setCarrito}
        onIrACotizar={() => setPantallaActual('cotizacion')}
      />

      {/* Project Files (19 files) & APK Builder Modal */}
      <ModalArchivosAPK
        abierto={modalArchivosAbierto}
        onCerrar={() => setModalArchivosAbierto(false)}
      />

    </div>
  );
}
