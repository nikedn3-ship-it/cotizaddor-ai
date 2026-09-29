export interface Articulo {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  imagenUrl?: string;
}

export interface ItemCotizacion {
  articuloId: string;
  sku: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  descuentoPorcentaje: number;
  subtotal: number;
  imagenUrl?: string;
}

export type EstadoCotizacion = 'pendiente' | 'aprobada' | 'rechazada';

export interface Cotizacion {
  id: string;
  numero: string;
  fecha: string;
  clienteNombre: string;
  empresa: string;
  email: string;
  telefono: string;
  documentoIdentidad?: string; // RUT/RFC/NIT
  items: ItemCotizacion[];
  subtotalBruto: number;
  descuentoGlobalPorcentaje: number;
  montoDescuento: number;
  subtotalNeto: number;
  tasaIva: number; // e.g. 0.16 (16%)
  montoIva: number;
  total: number;
  estado: EstadoCotizacion;
  observaciones?: string;
  validezDias: number;
  creadoEn: string;
}

export interface Estadisticas {
  totalArticulos: number;
  totalCotizaciones: number;
  totalMonto: number;
  cotizacionesAprobadas: number;
  cotizacionesPendientes: number;
  cotizacionesRechazadas: number;
  tasaAprobacion: number;
  ticketPromedio: number;
}

export interface ItemAccionPropuesta {
  sku: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface AccionPropuesta {
  tipo: 'agregar_carrito' | 'crear_paquete' | 'calculo_tecnico';
  titulo: string;
  descripcion?: string;
  items?: ItemAccionPropuesta[];
  descuentoSugerido?: number;
  datosTecnicos?: {
    metrosCable?: number;
    camaras?: number;
    diasGrabacion?: number;
    discoTB?: number;
    ducteriaMetros?: number;
  };
}

export interface MensajeChat {
  id: string;
  remitente: 'usuario' | 'ia' | 'user';
  texto: string;
  timestamp: string;
  sugerencias?: string[];
  acciones?: AccionPropuesta[];
}

export interface ArchivoProyecto {
  nombre: string;
  ruta: string;
  categoria: 'esencial' | 'script' | 'guia' | 'codigo';
  tamano: string;
  descripcion: string;
  contenido: string;
}
