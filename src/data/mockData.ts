import { Articulo, Cotizacion } from '../types';

export const ARTICULOS_INICIALES: Articulo[] = [
  {
    id: 'art-001',
    sku: 'SRV-DL380-G10',
    nombre: 'Servidor HPE ProLiant DL380 Gen10',
    descripcion: 'Intel Xeon Silver 4210R, 32GB RAM DDR4, 2x 480GB SSD SATA, Fuente Redundante 500W',
    categoria: 'Servidores',
    precio: 2890.0,
    stock: 8,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-002',
    sku: 'LAP-THINK-T14',
    nombre: 'Laptop Lenovo ThinkPad T14 Gen 4',
    descripcion: 'Core i7-1355U, 16GB RAM DDR5, 512GB SSD NVMe, Pantalla 14" FHD IPS, Windows 11 Pro',
    categoria: 'Computadoras',
    precio: 1350.0,
    stock: 24,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-003',
    sku: 'SW-CISCO-C9200',
    nombre: 'Switch Cisco Catalyst C9200L 24P PoE+',
    descripcion: '24 puertos Gigabit Ethernet PoE+ (370W), 4 enlaces ascendentes 1G SFP fijo, Layer 3',
    categoria: 'Redes',
    precio: 1980.0,
    stock: 12,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-004',
    sku: 'FW-FORTI-60F',
    nombre: 'Firewall Fortinet FortiGate 60F',
    descripcion: 'Next Generation Firewall con throughput de protección contra amenazas de 700 Mbps, 10 puertos GE',
    categoria: 'Seguridad',
    precio: 850.0,
    stock: 15,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-005',
    sku: 'LIC-M365-BUSP',
    nombre: 'Licencia Microsoft 365 Business Premium',
    descripcion: 'Suscripción anual por usuario. Office apps, Exchange, Teams, Intune, Defender for Business',
    categoria: 'Software',
    precio: 264.0,
    stock: 150,
    unidad: 'licencia/año',
    imagenUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-006',
    sku: 'UPS-APC-SMT1500',
    nombre: 'UPS APC Smart-UPS 1500VA LCD 120V',
    descripcion: '1000 Watts / 1500 VA, pantalla LCD interactiva, 8 tomas NEMA 5-15R, SmartConnect',
    categoria: 'Energía',
    precio: 620.0,
    stock: 18,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-007',
    sku: 'AP-UNIFI-U6PRO',
    nombre: 'Punto de Acceso Ubiquiti UniFi U6 Pro',
    descripcion: 'Access Point WiFi 6 de doble banda, hasta 5.3 Gbps agregados, cobertura 140 m²',
    categoria: 'Redes',
    precio: 175.0,
    stock: 35,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-008',
    sku: 'SRV-CAB-RACK42',
    nombre: 'Gabinete Rack Servidor 42U 800x1000mm',
    descripcion: 'Rack para centro de datos con puertas microperforadas, cerradura de seguridad, organizadores',
    categoria: 'Infraestructura',
    precio: 1100.0,
    stock: 5,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-009',
    sku: 'SRV-INST-CONF',
    nombre: 'Servicio de Configuración e Implementación',
    descripcion: 'Jornada de ingeniería especializada en despliegue de infraestructura, VLANs y políticas de seguridad',
    categoria: 'Servicios',
    precio: 450.0,
    stock: 999,
    unidad: 'jornada',
    imagenUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-010',
    sku: 'NAS-SYN-DS923',
    nombre: 'Almacenamiento NAS Synology DiskStation DS923+',
    descripcion: '4 bahías, AMD Ryzen R1600 dual-core, 4GB DDR4 ECC, 2x M.2 NVMe slots, dual 1GbE',
    categoria: 'Almacenamiento',
    precio: 720.0,
    stock: 10,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-011',
    sku: 'MON-DELL-P2723D',
    nombre: 'Monitor Profesional Dell 27" QHD P2723D',
    descripcion: 'Panel IPS 2560x1440 60Hz, 99% sRGB, Hub USB 3.2, ajuste de altura y rotación',
    categoria: 'Monitores',
    precio: 310.0,
    stock: 28,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-012',
    sku: 'CAB-UTP-CAT6A',
    nombre: 'Carrete Cable UTP Cat6A 100% Cobre 305m',
    descripcion: 'Bobina de cable de red 23 AWG para altas velocidades hasta 10GBASE-T, chaqueta CMR',
    categoria: 'Redes',
    precio: 215.0,
    stock: 40,
    unidad: 'bobina 305m',
    imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-013',
    sku: 'CAM-CCTV-4KIP',
    nombre: 'Cámara IP 4K 8MP Ultra HD PoE IR 40m IP67 Exterior',
    descripcion: 'Cámara domo/bala metálica con lente varifocal motorizado 2.8-12mm, analíticas inteligentes y visión nocturna',
    categoria: 'CCTV',
    precio: 125.0,
    stock: 50,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-014',
    sku: 'NVR-HIK-16P4K',
    nombre: 'Grabador NVR 16 Canales 4K con 16 Puertos PoE',
    descripcion: 'NVR profesional para CCTV con switch PoE integrado de 16 puertos, soporte para 2x HDD SATA de hasta 16TB, compresión H.265+',
    categoria: 'CCTV',
    precio: 480.0,
    stock: 14,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-015',
    sku: 'HDD-WD-PURPLE8T',
    nombre: 'Disco Duro Western Digital Purple Pro 8TB Vigilancia',
    descripcion: 'Disco especial para grabación continua de CCTV 24/7, 7200 RPM, 256MB caché, tecnología AllFrame AI',
    categoria: 'CCTV',
    precio: 240.0,
    stock: 22,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-016',
    sku: 'CAN-COND-EMT34',
    nombre: 'Tubería Conduit Galvanizada EMT 3/4" x 3m (Infraestructura Civil)',
    descripcion: 'Tubo de acero galvanizado para canalización segura de cableado estructurado y CCTV en muros, techos y fachadas',
    categoria: 'Infraestructura Civil',
    precio: 18.5,
    stock: 200,
    unidad: 'tramo 3m',
    imagenUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-017',
    sku: 'TEL-VOIP-YEALINK',
    nombre: 'Teléfono IP Empresarial Yealink SIP-T46U Gigabit PoE',
    descripcion: 'Teléfono de voz y datos con pantalla a color de 4.3", 16 cuentas SIP, doble puerto Gigabit Ethernet, soporte PoE y voz Optima HD',
    categoria: 'Voz y Datos',
    precio: 185.0,
    stock: 30,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-018',
    sku: 'RAC-WALL-12U',
    nombre: 'Gabinete de Pared 12U Abatible para Telecom & CCTV',
    descripcion: 'Rack mural con puerta frontal de cristal templado, cerradura de seguridad, paneles laterales desmontables y ventilación forzada',
    categoria: 'Infraestructura',
    precio: 195.0,
    stock: 16,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-019',
    sku: 'AUD-AMP-MULTI4',
    nombre: 'Amplificador Inteligente Multizona Streaming 4 Zonas Hi-Fi',
    descripcion: 'Matriz amplificadora 8x100W RMS @ 8Ω con streaming independiente por zona (AirPlay 2, Spotify Connect, WiFi, Dante/PoE, app móvil y control por voz)',
    categoria: 'Audio Inteligente',
    precio: 890.0,
    stock: 14,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-020',
    sku: 'AUD-SPK-CEIL6',
    nombre: 'Par de Altavoces Coaxiales de Plafón 6.5" 70V/100V & 8Ω',
    descripcion: 'Bocinas empotrables de alta fidelidad con rejilla magnética sin borde para sonido ambiental residencial, comercial y corporativo',
    categoria: 'Audio Inteligente',
    precio: 145.0,
    stock: 40,
    unidad: 'par',
    imagenUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-021',
    sku: 'AUD-SPK-EXT8',
    nombre: 'Par de Bafles de Intemperie IP66 para Terrazas e Industria',
    descripcion: 'Altavoces resistentes a lluvia, humedad y rayos UV con soporte articulado para exteriores, jardines, terrazas y naves comerciales',
    categoria: 'Audio Inteligente',
    precio: 230.0,
    stock: 25,
    unidad: 'par',
    imagenUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'art-022',
    sku: 'AUD-MIC-PAGING',
    nombre: 'Estación de Voceo y Micrófono Cuello de Ganso IP',
    descripcion: 'Consola de megafonía digital con pantalla LCD, 8 botones de selección de zonas, timbre de atención previo y soporte para emergencias',
    categoria: 'Audio Inteligente',
    precio: 310.0,
    stock: 12,
    unidad: 'unidad',
    imagenUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80'
  }
];

export const COTIZACIONES_INICIALES: Cotizacion[] = [
  {
    id: 'cot-101',
    numero: 'COT-2024-001',
    fecha: '2024-09-01',
    clienteNombre: 'Carlos Morales Gómez',
    empresa: 'Constructora del Norte S.A. de C.V.',
    email: 'cmorales@delnortesa.com',
    telefono: '+52 55 4912 3344',
    documentoIdentidad: 'CND840219TX3',
    items: [
      {
        articuloId: 'art-002',
        sku: 'LAP-THINK-T14',
        nombre: 'Laptop Lenovo ThinkPad T14 Gen 4',
        precioUnitario: 1350.0,
        cantidad: 4,
        descuentoPorcentaje: 5,
        subtotal: 5130.0
      },
      {
        articuloId: 'art-005',
        sku: 'LIC-M365-BUSP',
        nombre: 'Licencia Microsoft 365 Business Premium',
        precioUnitario: 264.0,
        cantidad: 4,
        descuentoPorcentaje: 0,
        subtotal: 1056.0
      },
      {
        articuloId: 'art-009',
        sku: 'SRV-INST-CONF',
        nombre: 'Servicio de Configuración e Implementación',
        precioUnitario: 450.0,
        cantidad: 1,
        descuentoPorcentaje: 10,
        subtotal: 405.0
      }
    ],
    subtotalBruto: 6906.0,
    descuentoGlobalPorcentaje: 0,
    montoDescuento: 315.0,
    subtotalNeto: 6591.0,
    tasaIva: 0.16,
    montoIva: 1054.56,
    total: 7645.56,
    estado: 'aprobada',
    observaciones: 'Entrega en oficinas corporativas Torre Reforma. Pago en 2 exhibiciones acordado.',
    validezDias: 15,
    creadoEn: '2024-09-01T10:30:00Z'
  },
  {
    id: 'cot-102',
    numero: 'COT-2024-002',
    fecha: '2024-09-02',
    clienteNombre: 'Ing. Valeria Domínguez',
    empresa: 'Logística Global & Transporte',
    email: 'vdominguez@logiglobal.mx',
    telefono: '+52 81 8345 7799',
    documentoIdentidad: 'LGT1205048P1',
    items: [
      {
        articuloId: 'art-001',
        sku: 'SRV-DL380-G10',
        nombre: 'Servidor HPE ProLiant DL380 Gen10',
        precioUnitario: 2890.0,
        cantidad: 1,
        descuentoPorcentaje: 0,
        subtotal: 2890.0
      },
      {
        articuloId: 'art-006',
        sku: 'UPS-APC-SMT1500',
        nombre: 'UPS APC Smart-UPS 1500VA LCD 120V',
        precioUnitario: 620.0,
        cantidad: 1,
        descuentoPorcentaje: 0,
        subtotal: 620.0
      },
      {
        articuloId: 'art-003',
        sku: 'SW-CISCO-C9200',
        nombre: 'Switch Cisco Catalyst C9200L 24P PoE+',
        precioUnitario: 1980.0,
        cantidad: 1,
        descuentoPorcentaje: 5,
        subtotal: 1881.0
      }
    ],
    subtotalBruto: 5490.0,
    descuentoGlobalPorcentaje: 3,
    montoDescuento: 263.7,
    subtotalNeto: 5226.3,
    tasaIva: 0.16,
    montoIva: 836.21,
    total: 6062.51,
    estado: 'pendiente',
    observaciones: 'Pendiente de confirmación de aprobación presupuestaria por comité de TI.',
    validezDias: 30,
    creadoEn: '2024-09-02T14:15:00Z'
  },
  {
    id: 'cot-103',
    numero: 'COT-2024-003',
    fecha: '2024-09-03',
    clienteNombre: 'Lic. Roberto Silva',
    empresa: 'Consultores Financieros Alfa',
    email: 'rsilva@consultoresalfa.com',
    telefono: '+52 33 3612 9011',
    documentoIdentidad: 'CFA090915HQ2',
    items: [
      {
        articuloId: 'art-004',
        sku: 'FW-FORTI-60F',
        nombre: 'Firewall Fortinet FortiGate 60F',
        precioUnitario: 850.0,
        cantidad: 2,
        descuentoPorcentaje: 0,
        subtotal: 1700.0,
        imagenUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80'
      },
      {
        articuloId: 'art-007',
        sku: 'AP-UNIFI-U6PRO',
        nombre: 'Punto de Acceso Ubiquiti UniFi U6 Pro',
        precioUnitario: 175.0,
        cantidad: 6,
        descuentoPorcentaje: 5,
        subtotal: 997.5,
        imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotalBruto: 2750.0,
    descuentoGlobalPorcentaje: 0,
    montoDescuento: 52.5,
    subtotalNeto: 2697.5,
    tasaIva: 0.16,
    montoIva: 431.6,
    total: 3129.1,
    estado: 'aprobada',
    observaciones: 'Cotización con soporte de garantía extendida de 3 años incluida en equipos.',
    validezDias: 15,
    creadoEn: '2024-09-03T09:45:00Z'
  },
  {
    id: 'cot-104',
    numero: 'COT-2024-004',
    fecha: '2024-09-03',
    clienteNombre: 'Mariana Peñaloza',
    empresa: 'Diseño & Media Creativa',
    email: 'mpenaloza@mediacreativa.io',
    telefono: '+52 55 8820 1100',
    documentoIdentidad: 'DMC190112LK9',
    items: [
      {
        articuloId: 'art-011',
        sku: 'MON-DELL-P2723D',
        nombre: 'Monitor Profesional Dell 27" QHD P2723D',
        precioUnitario: 310.0,
        cantidad: 5,
        descuentoPorcentaje: 0,
        subtotal: 1550.0
      }
    ],
    subtotalBruto: 1550.0,
    descuentoGlobalPorcentaje: 0,
    montoDescuento: 0,
    subtotalNeto: 1550.0,
    tasaIva: 0.16,
    montoIva: 248.0,
    total: 1798.0,
    estado: 'rechazada',
    observaciones: 'Cliente optó por esperar presupuesto del siguiente trimestre fiscal.',
    validezDias: 10,
    creadoEn: '2024-09-03T16:20:00Z'
  }
];

export const MOCK_ARTICULOS = ARTICULOS_INICIALES;
export const MOCK_COTIZACIONES = COTIZACIONES_INICIALES;

export const MOCK_ESTADISTICAS = {
  totalArticulos: 12,
  totalCotizaciones: 4,
  totalMonto: 18635.17,
  cotizacionesAprobadas: 2,
  cotizacionesPendientes: 1,
  cotizacionesRechazadas: 1,
  tasaAprobacion: 50,
  ticketPromedio: 4658.79
};

export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monto);
}

export function formatearFecha(fechaStr: string): string {
  try {
    const fecha = new Date(fechaStr);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(fecha);
  } catch {
    return fechaStr;
  }
}
