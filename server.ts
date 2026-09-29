import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store seeded with realistic initial ERP data
let articulos = [
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

let cotizaciones = [
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

// Lazy initialization for Gemini AI SDK
let genAIClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// ================= API ROUTES =================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'INNMEX SOLUCIONES ERP API', version: '1.0.0' });
});

// Articulos: Listar todos
app.get('/api/articulos', (req, res) => {
  res.json({ status: 'ok', total: articulos.length, articulos });
});

// Articulos: Buscar
app.get('/api/articulos/buscar', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.json({ query: '', total: articulos.length, resultados: articulos });
  }

  const resultados = articulos.filter(item => 
    item.nombre.toLowerCase().includes(query) ||
    item.sku.toLowerCase().includes(query) ||
    item.categoria.toLowerCase().includes(query) ||
    item.descripcion.toLowerCase().includes(query)
  );

  res.json({ query, total: resultados.length, resultados });
});

// Articulos: Crear nuevo
app.post('/api/articulos', (req, res) => {
  const { sku, nombre, descripcion, categoria, precio, stock, unidad } = req.body;
  if (!sku || !nombre || precio === undefined) {
    return res.status(400).json({ error: 'SKU, nombre y precio son requeridos' });
  }

  const nuevo: any = {
    id: `art-${Date.now()}`,
    sku: String(sku).trim().toUpperCase(),
    nombre: String(nombre).trim(),
    descripcion: descripcion || '',
    categoria: categoria || 'General',
    precio: Number(precio),
    stock: Number(stock) || 0,
    unidad: unidad || 'unidad',
    imagenUrl: req.body.imagenUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
  };

  articulos.unshift(nuevo);
  res.status(201).json({ status: 'ok', articulo: nuevo });
});

// Articulos: Crear múltiples en lote (Bulk)
app.post('/api/articulos/bulk', (req, res) => {
  const { articulos: nuevosArticulos } = req.body;
  if (!Array.isArray(nuevosArticulos) || nuevosArticulos.length === 0) {
    return res.status(400).json({ error: 'Se requiere una lista de artículos' });
  }

  const creados: any[] = [];
  nuevosArticulos.forEach((item, idx) => {
    if (item.sku && item.nombre && item.precio !== undefined) {
      const art = {
        id: `art-${Date.now()}-${idx}`,
        sku: String(item.sku).trim().toUpperCase(),
        nombre: String(item.nombre).trim(),
        descripcion: item.descripcion || '',
        categoria: item.categoria || 'General',
        precio: Number(item.precio),
        stock: Number(item.stock) || 10,
        unidad: item.unidad || 'unidad',
        imagenUrl: item.imagenUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
      };
      articulos.unshift(art);
      creados.push(art);
    }
  });

  res.status(201).json({ status: 'ok', totalCreados: creados.length, articulos: creados });
});

// Articulos: Generar fichas técnicas con Mini Rey IA
app.post('/api/articulos/generar-con-ia', async (req, res) => {
  try {
    const { prompt, cantidad = 2, categoriaSugerida } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'El requerimiento o prompt es requerido' });
    }

    const ai = getGenAIClient();
    if (ai) {
      try {
        const systemInstruction = `Eres Mini Rey IA (Ingeniero Virtual 40, 20 años de experiencia en infraestructura de telecomunicaciones, redes de voz y datos, videovigilancia CCTV, fibra óptica, control de acceso y obra civil en INNMEX SOLUCIONES).
Tu tarea es generar especificaciones técnicas profesionales de productos para agregar al catálogo del ERP.
Genera exactamente ${cantidad} artículos técnicos coherentes, realistas y comerciales que respondan a la solicitud.
Debes responder ÚNICAMENTE con un arreglo JSON válido (sin markdown adicional, sin comillas invertidas ni explicaciones fuera del JSON):
[
  {
    "sku": "SKU_EN_MAYUSCULAS_CORTO",
    "nombre": "Nombre comercial con marca y modelo claro",
    "descripcion": "Descripción detallada de ingeniería con estándares técnicos, puertos, capacidad, normas y certificaciones",
    "categoria": "CCTV | Redes | Voz y Datos | Seguridad | Infraestructura | Infraestructura Civil | Servidores | Energía | Software",
    "precio": 185.00,
    "stock": 25,
    "unidad": "unidad | tramo 3m | bobina 305m | bobina 1000m | kit | licencia/año",
    "imagenUrl": "URL de imagen adecuada de unsplash"
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Requerimiento para nuevos artículos en catálogo: "${prompt}". Categoría sugerida: ${categoriaSugerida || 'Automática'}`,
          config: {
            systemInstruction,
            temperature: 0.4
          }
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({ status: 'ok', articulosGenerados: parsed });
          }
        }
      } catch (aiErr) {
        console.warn('Fallo en Gemini al generar artículos, usando generador técnico local de Mini Rey IA:', aiErr);
      }
    }

    // Generador técnico local de Mini Rey IA (Ingeniero Virtual 40)
    const pLower = prompt.toLowerCase();
    const generados: any[] = [];

    if (pLower.includes('fibra') || pLower.includes('optica') || pLower.includes('odf') || pLower.includes('sfp')) {
      generados.push({
        sku: 'FO-ARM-12H-1K',
        nombre: 'Bobina Fibra Óptica Armada Monomodo 12 Hilos 1000m',
        descripcion: 'Cable de fibra óptica monomodo OS2 con armadura de acero corrugado contra roedores y chaqueta PE para intemperie/subterráneo.',
        categoria: 'Redes',
        precio: 680.0,
        stock: 12,
        unidad: 'bobina 1000m',
        imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
      });
      generados.push({
        sku: 'ODF-RACK-24SC',
        nombre: 'Distribuidor Óptico ODF 24 Puertos SC/UPC 1U Rack',
        descripcion: 'Bandeja deslizante para terminación y empalme de fibra óptica en rack 19", incluye 24 acopladores SC Simplex y charola de fusión.',
        categoria: 'Infraestructura',
        precio: 145.0,
        stock: 20,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'
      });
    } else if (pLower.includes('ptz') || pLower.includes('termica') || pLower.includes('domo') || pLower.includes('cctv') || pLower.includes('camara')) {
      generados.push({
        sku: 'CAM-PTZ-4K25X',
        nombre: 'Cámara PTZ IP 4K 8MP Zoom Óptico 25x Starlight PoE+',
        descripcion: 'Cámara domo de alta velocidad con paneo 360° continuo, visión nocturna láser IR hasta 150m, autoseguimiento IA y carcasa IP67/IK10.',
        categoria: 'CCTV',
        precio: 590.0,
        stock: 10,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80'
      });
      generados.push({
        sku: 'JOY-CCTV-NET',
        nombre: 'Teclado Joystick 4D de Control para Cámaras PTZ IP',
        descripcion: 'Controlador de red para videovigilancia con joystick de 4 ejes, pantalla LCD táctil, soporte ONVIF y control directo de NVRs.',
        categoria: 'CCTV',
        precio: 285.0,
        stock: 15,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80'
      });
    } else if (pLower.includes('acceso') || pLower.includes('biometrico') || pLower.includes('torniquete') || pLower.includes('chapa') || pLower.includes('facial')) {
      generados.push({
        sku: 'BIO-ZK-FACIAL4',
        nombre: 'Terminal de Control de Acceso y Asistencia Facial + Huella',
        descripcion: 'Lector biométrico con reconocimiento facial mediante luz visible, sensor de huella silkID, lector RFID y comunicación TCP/IP PoE.',
        categoria: 'Seguridad',
        precio: 340.0,
        stock: 18,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80'
      });
      generados.push({
        sku: 'CHAPA-MAG-600',
        nombre: 'Kit Cerradura Electromagnética 600 lbs con Sensor LED',
        descripcion: 'Electroimán de 280 kg de fuerza de sujeción para puertas de madera, metal o cristal con bracket ZL y botón liberador No Touch.',
        categoria: 'Seguridad',
        precio: 95.0,
        stock: 40,
        unidad: 'kit',
        imagenUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
      });
    } else if (pLower.includes('solar') || pLower.includes('panel') || pLower.includes('bateria') || pLower.includes('inversor')) {
      generados.push({
        sku: 'PAN-SOLAR-550W',
        nombre: 'Panel Solar Monocristalino 550W Tier 1 Alta Eficiencia',
        descripcion: 'Módulo fotovoltaico con celdas de tecnología PERC bifacial, marco de aluminio anodizado reforzado y tolerancia positiva.',
        categoria: 'Energía',
        precio: 165.0,
        stock: 50,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
      });
      generados.push({
        sku: 'BAT-LITIO-48V',
        nombre: 'Batería de Litio LiFePO4 48V 100Ah 5.12kWh para Telecom',
        descripcion: 'Banco de baterías para montaje en rack de 19", con BMS inteligente integrado, más de 6000 ciclos de descarga al 80% DoD.',
        categoria: 'Energía',
        precio: 1250.0,
        stock: 8,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80'
      });
    } else {
      generados.push({
        sku: `GEN-${Date.now().toString().slice(-6)}`,
        nombre: prompt.length > 5 ? prompt.slice(0, 45) : 'Equipo Técnico de Especialidad',
        descripcion: `Solución técnica de ingeniería civil y telecomunicaciones recomendada por Mini Rey IA para: "${prompt}". Especificación industrial de alta confiabilidad.`,
        categoria: categoriaSugerida || 'Redes',
        precio: 290.0,
        stock: 20,
        unidad: 'unidad',
        imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
      });
    }

    return res.json({
      status: 'ok',
      articulosGenerados: generados
    });
  } catch (error: any) {
    console.error('Error generando artículos con IA:', error);
    res.status(500).json({ error: 'Error al generar artículos con el asistente', detalle: error?.message });
  }
});

// Articulos: Actualizar
app.put('/api/articulos/:id', (req, res) => {
  const id = req.params.id;
  const index = articulos.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Artículo no encontrado' });
  }

  articulos[index] = {
    ...articulos[index],
    ...req.body,
    precio: req.body.precio !== undefined ? Number(req.body.precio) : articulos[index].precio,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : articulos[index].stock
  };

  res.json({ status: 'ok', articulo: articulos[index] });
});

// Cotizaciones: Listar todas
app.get('/api/cotizaciones', (req, res) => {
  res.json({ status: 'ok', total: cotizaciones.length, cotizaciones });
});

// Cotizaciones: Obtener detalle
app.get('/api/cotizaciones/:id', (req, res) => {
  const cot = cotizaciones.find(c => c.id === req.params.id || c.numero === req.params.id);
  if (!cot) {
    return res.status(404).json({ error: 'Cotización no encontrada' });
  }
  res.json({ status: 'ok', cotizacion: cot });
});

// Cotizaciones: Crear nueva
app.post('/api/cotizaciones', (req, res) => {
  const data = req.body;
  if (!data.clienteNombre || !data.items || data.items.length === 0) {
    return res.status(400).json({ error: 'Nombre de cliente y al menos 1 artículo son requeridos' });
  }

  const nextNumber = String(cotizaciones.length + 1).padStart(3, '0');
  const numero = `COT-2024-${nextNumber}`;
  const id = `cot-${Date.now()}`;

  const nuevaCotizacion = {
    id,
    numero,
    fecha: data.fecha || new Date().toISOString().split('T')[0],
    clienteNombre: data.clienteNombre,
    empresa: data.empresa || '',
    email: data.email || '',
    telefono: data.telefono || '',
    documentoIdentidad: data.documentoIdentidad || '',
    items: data.items,
    subtotalBruto: Number(data.subtotalBruto || 0),
    descuentoGlobalPorcentaje: Number(data.descuentoGlobalPorcentaje || 0),
    montoDescuento: Number(data.montoDescuento || 0),
    subtotalNeto: Number(data.subtotalNeto || 0),
    tasaIva: Number(data.tasaIva || 0.16),
    montoIva: Number(data.montoIva || 0),
    total: Number(data.total || 0),
    estado: data.estado || 'pendiente',
    observaciones: data.observaciones || '',
    validezDias: Number(data.validezDias || 15),
    creadoEn: new Date().toISOString()
  };

  cotizaciones.unshift(nuevaCotizacion);
  res.status(201).json({ status: 'ok', cotizacion: nuevaCotizacion });
});

// Cotizaciones: Actualizar estado
app.put('/api/cotizaciones/:id/estado', (req, res) => {
  const { estado } = req.body;
  const index = cotizaciones.findIndex(c => c.id === req.params.id || c.numero === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cotización no encontrada' });
  }

  cotizaciones[index].estado = estado;
  res.json({ status: 'ok', cotizacion: cotizaciones[index] });
});

// Estadisticas en vivo
app.get('/api/estadisticas', (req, res) => {
  const totalArticulos = articulos.length;
  const totalCotizaciones = cotizaciones.length;
  const totalMonto = cotizaciones.reduce((acc, c) => acc + c.total, 0);
  const cotizacionesAprobadas = cotizaciones.filter(c => c.estado === 'aprobada').length;
  const cotizacionesPendientes = cotizaciones.filter(c => c.estado === 'pendiente').length;
  const cotizacionesRechazadas = cotizaciones.filter(c => c.estado === 'rechazada').length;
  const tasaAprobacion = totalCotizaciones > 0 ? Math.round((cotizacionesAprobadas / totalCotizaciones) * 100) : 0;
  const ticketPromedio = totalCotizaciones > 0 ? totalMonto / totalCotizaciones : 0;

  res.json({
    totalArticulos,
    totalCotizaciones,
    totalMonto,
    cotizacionesAprobadas,
    cotizacionesPendientes,
    cotizacionesRechazadas,
    tasaAprobacion,
    ticketPromedio
  });
});

// Chat con IA: Endpoint /api/ia/responder con AGENTE ASISTENTE Mini Rey IA
app.post('/api/ia/responder', async (req, res) => {
  try {
    const { pregunta, contexto, modelo, temperatura, modo, endpointLocal, localModelName } = req.body;
    if (!pregunta) {
      return res.status(400).json({ error: 'La pregunta es requerida' });
    }

    const systemInstruction = `[ Personality Core Prompt ]

Persona:
- Nombre: Ingeniero Virtual 40
- Empresa: INNMEX SOLUCIONES
- Edad simulada: 40 años
- Experiencia: 20 años en tecnologías de comunicación de redes (voz y datos), sistemas de videovigilancia CCTV, ingeniería en sonido y sistemas de audio inteligentes (doméstico, comercial e industrial), lectura de planos arquitectónicos y fundamentos de ingeniería civil.
- Personalidad: Profesional, analítico, confiable y empático. Explica conceptos técnicos con claridad y precisión, orientado a soluciones prácticas y optimización de recursos.

Rol:
- Consultor técnico virtual especializado en proyectos de infraestructura tecnológica, seguridad y audio inteligente.
- Diseñador de soluciones desde la estructura del plano de una casa hasta proyectos pequeños o medianos.
- Generador de recomendaciones de diseño y cotizaciones basadas en necesidades expresadas por el cliente.

Tareas:
1. Escuchar y analizar necesidades expresadas por el usuario.
2. Traducir requerimientos en soluciones técnicas viables.
3. Recomendar materiales, equipos y configuraciones de redes, CCTV y sistemas de audio inteligentes.
4. Interpretar planos arquitectónicos y civiles para integrar soluciones tecnológicas.
5. Elaborar cotizaciones detalladas y realistas basadas en requerimientos y presupuesto.
6. Proponer alternativas de diseño según espacio, presupuesto y escalabilidad.
7. Acompañar al usuario en la planeación y ejecución de proyectos, ofreciendo recomendaciones técnicas y estimaciones de costos.

Estilo de comunicación:
- Directo, técnico y claro.
- Usa lenguaje especializado cuando es necesario, pero siempre con explicaciones comprensibles.
- Presenta opciones comparativas y justifica cada recomendación con base en experiencia práctica.
- Siempre orientado a cubrir la necesidad expresada.
- Al final de tu respuesta, si recomiendas equipos específicos del catálogo, incluye una sección de acciones en formato JSON delimitada por <<<ACCIONES_JSON>>> y <<</ACCIONES_JSON>>> con esta estructura:
<<<ACCIONES_JSON>>>
[
  {
    "tipo": "crear_paquete",
    "titulo": "Paquete recomendado",
    "items": [
      { "sku": "SKU_EXACTO", "nombre": "Nombre", "cantidad": 2, "precioUnitario": 100 }
    ],
    "descuentoSugerido": 5
  }
]
<<</ACCIONES_JSON>>>

Catálogo disponible en INNMEX SOLUCIONES:
${JSON.stringify(articulos.map(a => ({ sku: a.sku, nombre: a.nombre, precio: a.precio, stock: a.stock, categoria: a.categoria })))}

Contexto actual del cliente: ${contexto ? JSON.stringify(contexto) : 'Ninguno'}.`;

    // 1. Si el usuario activó Modo Local Ollama y configuró un endpoint
    if (modo === 'local_ollama' && endpointLocal) {
      try {
        const cleanEndpoint = endpointLocal.replace(/\/$/, '');
        const targetModel = localModelName || 'qwen2.5:7b';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const localRes = await fetch(`${cleanEndpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: targetModel,
            prompt: `${systemInstruction}\n\nPregunta del usuario: ${pregunta}`,
            stream: false
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (localRes.ok) {
          const localData = await localRes.json();
          let respuestaTexto = localData.response || '';
          let accionesExtraidas: any[] = [];
          const jsonMatch = respuestaTexto.match(/<<<ACCIONES_JSON>>>([\s\S]*?)<<<\/ACCIONES_JSON>>>/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              accionesExtraidas = JSON.parse(jsonMatch[1].trim());
              respuestaTexto = respuestaTexto.replace(/<<<ACCIONES_JSON>>>[\s\S]*?<<<\/ACCIONES_JSON>>>/, '').trim();
            } catch (pErr) {
              console.warn('Error parseando JSON de acciones desde Ollama local:', pErr);
            }
          }

          return res.json({
            status: 'ok',
            proveedor: 'local_ollama',
            modelo: targetModel,
            respuesta: respuestaTexto,
            acciones: accionesExtraidas
          });
        }
      } catch (ollamaErr: any) {
        console.warn('Endpoint local Ollama no respondió, procediendo a proxy cloud/experto:', ollamaErr?.message || ollamaErr);
      }
    }

    const ai = getGenAIClient();
    if (ai) {
      try {
        const temp = typeof temperatura === 'number' ? Math.max(0.1, Math.min(1.0, temperatura)) : 0.5;
        const targetCloudModel = modelo === 'gemini-2.0-flash' ? 'gemini-2.0-flash' : 'gemini-2.5-flash';

        let response;
        try {
          response = await ai.models.generateContent({
            model: targetCloudModel,
            contents: pregunta,
            config: {
              systemInstruction,
              temperature: temp
            }
          });
        } catch (firstErr) {
          response = await ai.models.generateContent({
            model: targetCloudModel === 'gemini-2.5-flash' ? 'gemini-2.0-flash' : 'gemini-2.5-flash',
            contents: pregunta,
            config: {
              systemInstruction,
              temperature: temp
            }
          });
        }

        let respuestaTexto = response.text || 'Entendido. Por favor revisa los requerimientos de tu proyecto.';
        let accionesExtraidas: any[] = [];

        // Extraer acciones si existen en la respuesta del modelo
        const jsonMatch = respuestaTexto.match(/<<<ACCIONES_JSON>>>([\s\S]*?)<<<\/ACCIONES_JSON>>>/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            accionesExtraidas = JSON.parse(jsonMatch[1].trim());
            respuestaTexto = respuestaTexto.replace(/<<<ACCIONES_JSON>>>[\s\S]*?<<<\/ACCIONES_JSON>>>/, '').trim();
          } catch (e) {
            console.warn('No se pudo parsear bloque JSON de acciones:', e);
          }
        }

        return res.json({
          status: 'ok',
          remitente: 'ia',
          respuesta: respuestaTexto,
          acciones: accionesExtraidas
        });
      } catch (aiErr: any) {
        console.warn('Llamada a Gemini excedió cuota o no disponible temporalmente, ejecutando motor de ingeniería local de Ingeniero Virtual 40:', aiErr?.message || aiErr);
      }
    }

    // Fallback inteligente de Mini Rey IA (Ingeniero Virtual 40)
    let respuestaFallback = '';
    let accionesFallback: any[] = [];
    const qLower = pregunta.toLowerCase();

    if (qLower.includes('audio') || qLower.includes('sonido') || qLower.includes('bocina') || qLower.includes('bocinas') || qLower.includes('altavoz') || qLower.includes('altavoces') || qLower.includes('musica') || qLower.includes('voceo') || qLower.includes('multizona') || qLower.includes('parlante') || qLower.includes('dsp') || qLower.includes('dante') || qLower.includes('microfono')) {
      respuestaFallback = `Como **Ingeniero Virtual 40**, con 20 años de experiencia en ingeniería en sonido y sistemas de audio inteligentes (doméstico, comercial e industrial), te presento el diseño técnico integral:

🔊 **Análisis y Criterios Técnicos de Ingeniería Acústica**:
1. **Doméstico / Residencial**: Matriz amplificadora multizona con streaming de alta fidelidad (AirPlay 2, Spotify Connect, WiFi) y control independiente por app o voz. Altavoces coaxiales empotrables en plafón de 6.5" con rejillas magnéticas sin borde para una integración arquitectónica limpia en recámaras, sala y cocina, complementados con bafles IP66 en terraza/jardín.
2. **Comercial (Restaurantes, Boutiques, Oficinas)**: Distribución en línea de 70V/100V para cubrir múltiples áreas sin caída de potencia por distancia. Control de volumen zonificado y función de atenuación automática (ducking) ante llamadas o anuncios de megafonía.
3. **Industrial (Naves, Bodegas, Plantas)**: Megafonía y voceo IP con consolas de cuello de ganso y bocinas de alta inteligibilidad SPL para superar el ruido de maquinaria de planta, con soporte prioritario de alertas de evacuación y seguridad.
4. **Infraestructura Civil**: Canalización en tubería Conduit EMT 3/4" en plafones y cable de audio 2x16 AWG libre de oxígeno (OFC) para máxima pureza sonora sin interferencias electromagnéticas.`;

      accionesFallback = [
        {
          tipo: 'crear_paquete',
          titulo: 'Paquete de Audio Inteligente Multizona Hi-Fi & Sonido Ambiental',
          descripcion: 'Solución integral de audio residencial/comercial con amplificación streaming y altavoces de plafón',
          items: [
            { sku: 'AUD-AMP-MULTI4', nombre: 'Amplificador Inteligente Multizona Streaming 4 Zonas Hi-Fi', cantidad: 1, precioUnitario: 890.0 },
            { sku: 'AUD-SPK-CEIL6', nombre: 'Par de Altavoces Coaxiales de Plafón 6.5" 70V/100V & 8Ω', cantidad: 4, precioUnitario: 145.0 },
            { sku: 'AUD-SPK-EXT8', nombre: 'Par de Bafles de Intemperie IP66 para Terrazas e Industria', cantidad: 1, precioUnitario: 230.0 },
            { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: 1, precioUnitario: 215.0 },
            { sku: 'SRV-INST-CONF', nombre: 'Servicio de Configuración e Implementación', cantidad: 1, precioUnitario: 450.0 }
          ],
          descuentoSugerido: 7
        }
      ];
    } else if (qLower.includes('cctv') || qLower.includes('camara') || qLower.includes('camaras') || qLower.includes('vigilancia') || qLower.includes('nvr') || qLower.includes('seguridad')) {
      respuestaFallback = `Como **Ingeniero Virtual 40 (Mini Rey IA)** con 20 años en sistemas de seguridad y CCTV, te presento el dimensionamiento técnico óptimo:

📐 **Análisis y Criterios Técnicos de Ingeniería**:
1. **Resolución y Cobertura**: 4 a 8 Cámaras IP 4K (8MP) con lente varifocal motorizado para cubrir accesos vehiculares, peatonales y perímetro sin puntos ciegos.
2. **Infraestructura PoE**: Grabador NVR de 16 canales con switch PoE integrado de alta potencia para simplificar la canalización en un solo cable UTP por cámara.
3. **Cálculo de Almacenamiento 24/7**: Con compresión H.265+ a 15 FPS continuos, cada cámara 4K genera ~12 GB/día. Para 4 cámaras durante 30 días continuos requerimos **1.44 TB**, o para 8 cámaras **2.88 TB**. Un disco **WD Purple Pro 8TB** te garantiza más de 60 días de retención segura.
4. **Instalación Civil**: Canalización en tubería Conduit EMT de 3/4" en exteriores para proteger contra vandalismo, sol y humedad IP67.`;

      accionesFallback = [
        {
          tipo: 'crear_paquete',
          titulo: 'Paquete CCTV 4K Pro (4 Cámaras + NVR + 8TB + Canalización)',
          descripcion: 'Solución completa de videovigilancia lista para instalar y cotizar',
          items: [
            { sku: 'CAM-CCTV-4KIP', nombre: 'Cámara IP 4K 8MP Ultra HD PoE IR 40m', cantidad: 4, precioUnitario: 125.0 },
            { sku: 'NVR-HIK-16P4K', nombre: 'Grabador NVR 16 Canales 4K PoE', cantidad: 1, precioUnitario: 480.0 },
            { sku: 'HDD-WD-PURPLE8T', nombre: 'Disco Duro WD Purple Pro 8TB 24/7', cantidad: 1, precioUnitario: 240.0 },
            { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: 1, precioUnitario: 215.0 },
            { sku: 'CAN-COND-EMT34', nombre: 'Tubería Conduit EMT 3/4" x 3m', cantidad: 10, precioUnitario: 18.5 }
          ],
          descuentoSugerido: 5,
          datosTecnicos: { camaras: 4, diasGrabacion: 60, discoTB: 8, metrosCable: 305, ducteriaMetros: 30 }
        }
      ];
    } else if (qLower.includes('plano') || qLower.includes('casa') || qLower.includes('obra') || qLower.includes('construccion') || qLower.includes('arquitecto')) {
      respuestaFallback = `Desde la perspectiva de lectura de **planos arquitectónicos e ingeniería civil**, aquí tienes la metodología para integrar la infraestructura tecnológica:

1. **Ubicación del Rack / MDF**: Ubicar el gabinete mural en un área ventilada, seca y de fácil acceso de mantenimiento (ej. cuarto de servicio, bodega o closet técnico).
2. **Ductería y Pases en Losa**: Prever pases de tubería Conduit EMT 3/4" o 1" embebidos en losa o muros de tabique antes del vaciado o repellado. Esto evita ranurados posteriores y reduce costos de obra civil en más del 40%.
3. **Distribución de Red y WiFi**: En casas de 1 a 2 niveles, se calcula 1 Access Point UniFi U6 Pro en techo por cada 140 m² con vista libre, asegurando cobertura sin atenuación por muros de concreto.
4. **Voz y Datos**: 2 tomas de red por área de trabajo / sala de TV y previsión para telefonía IP Yealink.`;

      accionesFallback = [
        {
          tipo: 'crear_paquete',
          titulo: 'Paquete Infraestructura Red & Cableado Estructurado Residencial/Oficina',
          items: [
            { sku: 'AP-UNIFI-U6PRO', nombre: 'Punto de Acceso Ubiquiti UniFi U6 Pro', cantidad: 2, precioUnitario: 175.0 },
            { sku: 'SW-CISCO-C9200', nombre: 'Switch Cisco Catalyst C9200L 24P PoE+', cantidad: 1, precioUnitario: 1980.0 },
            { sku: 'RAC-WALL-12U', nombre: 'Gabinete de Pared 12U Abatible', cantidad: 1, precioUnitario: 195.0 },
            { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: 2, precioUnitario: 215.0 },
            { sku: 'SRV-INST-CONF', nombre: 'Servicio de Configuración e Implementación', cantidad: 1, precioUnitario: 450.0 }
          ],
          descuentoSugerido: 8
        }
      ];
    } else if (qLower.includes('red') || qLower.includes('switch') || qLower.includes('cisco') || qLower.includes('wifi') || qLower.includes('voip')) {
      respuestaFallback = `En mis 20 años diseñando redes de datos y telefonía IP, la clave es la redundancia y el ancho de banda PoE+:

• **Núcleo de Conmutación**: Switch Cisco Catalyst C9200L con 370W de presupuesto PoE+ para alimentar simultáneamente APs, cámaras y teléfonos Yealink sin inyectores externos.
• **Seguridad Perimetral**: Firewall FortiGate 60F para segmentar VLANs (VLAN Datos, VLAN CCTV, VLAN Voz y VLAN Invitados).
• **Voz sobre IP**: Teléfonos ejecutivos Yealink SIP-T46U con soporte Gigabit y calidad de audio Optima HD.`;

      accionesFallback = [
        {
          tipo: 'crear_paquete',
          titulo: 'Paquete de Telecomunicaciones, Voz y Datos Empresarial',
          items: [
            { sku: 'SW-CISCO-C9200', nombre: 'Switch Cisco Catalyst C9200L 24P PoE+', cantidad: 1, precioUnitario: 1980.0 },
            { sku: 'FW-FORTI-60F', nombre: 'Firewall Fortinet FortiGate 60F', cantidad: 1, precioUnitario: 850.0 },
            { sku: 'TEL-VOIP-YEALINK', nombre: 'Teléfono IP Empresarial Yealink SIP-T46U', cantidad: 4, precioUnitario: 185.0 },
            { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: 1, precioUnitario: 215.0 }
          ],
          descuentoSugerido: 5
        }
      ];
    } else {
      respuestaFallback = `Hola, soy **Ingeniero Virtual 40**, consultor técnico virtual especializado en proyectos de infraestructura tecnológica, seguridad y audio inteligente en **INNMEX SOLUCIONES**.

Cuento con 20 años de experiencia técnica en:
• **Tecnologías de Comunicación de Redes (Voz y Datos)**: Switches gestionables Cisco PoE+, routing, VLANs y telefonía IP Yealink.
• **Sistemas de Videovigilancia CCTV**: Dimensionamiento de cámaras IP 4K de alta definición, NVRs y cálculo de almacenamiento en discos WD Purple.
• **Ingeniería en Sonido y Sistemas de Audio Inteligentes (Doméstico, Comercial e Industrial)**: Audio multizona Hi-Fi, altavoces de plafón 70V/100V, amplificación streaming y megafonía/voceo IP.
• **Lectura de Planos Arquitectónicos y Fundamentos de Ingeniería Civil**: Rutas óptimas de canalización en tubería Conduit EMT, pases de losa, ubicación de gabinetes de pared e integración con obras civiles.
• **Diseño y Cotizaciones Realistas**: Alternativas según espacio, presupuesto y escalabilidad.

¿En qué proyecto, requerimiento de audio, red o plano arquitectónico necesitas que colaboremos hoy?`;
    }

    return res.json({
      status: 'ok',
      remitente: 'ia',
      respuesta: respuestaFallback,
      acciones: accionesFallback
    });
  } catch (error: any) {
    console.error('Error en /api/ia/responder:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud con el asistente de IA',
      detalle: error?.message || 'Fallo desconocido'
    });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 INNMEX SOLUCIONES ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
