import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Trash2, 
  Lightbulb, 
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Video,
  Compass,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Cpu,
  Wrench,
  Check,
  Sliders,
  ChevronRight,
  Plus,
  Volume2,
  Settings,
  Laptop,
  X
} from 'lucide-react';
import { MensajeChat, ItemCotizacion, Articulo, AccionPropuesta } from '../types';
import { formatearMoneda } from '../data/mockData';
import { AjustesModelosIA, ConfiguracionIAMiniRey, CONFIG_IA_DEFAULT, MODELOS_LOCALES_CATALOGO } from './AjustesModelosIA';

interface PantallaChatIAProps {
  articulos: Articulo[];
  carrito: ItemCotizacion[];
  onAgregarAlCarrito?: (articulo: Articulo, cantidad?: number) => void;
  onGuardarArticulo?: (nuevoArticulo: Omit<Articulo, 'id'>) => Promise<Articulo | void>;
  onGuardarArticulosEnLote?: (nuevos: Omit<Articulo, 'id'>[]) => Promise<void>;
  onAbrirCarrito?: () => void;
  onIrABusqueda: () => void;
  onIrACotizacion: () => void;
}

export const PantallaChatIA: React.FC<PantallaChatIAProps> = ({
  articulos,
  carrito,
  onAgregarAlCarrito,
  onGuardarArticulo,
  onGuardarArticulosEnLote,
  onAbrirCarrito,
  onIrABusqueda,
  onIrACotizacion
}) => {
  // Mode: chat principal o herramientas interactivas de asistente
  const [pestanaActiva, setPestanaActiva] = useState<'chat' | 'dimensionador_cctv' | 'calculador_planos' | 'dimensionador_audio' | 'creador_catalogo' | 'ajustes_modelos'>('chat');
  
  // Notificación flotante de acción ejecutada
  const [alertaAccion, setAlertaAccion] = useState<string | null>(null);

  // Modal flotante de ajustes de modelos e IA local
  const [modalAjustesAbierto, setModalAjustesAbierto] = useState(false);

  // Configuración de Proveedor de IA y Modelos Locales
  const [configIA, setConfigIA] = useState<ConfiguracionIAMiniRey>(() => {
    try {
      const guardada = localStorage.getItem('innmex_config_ia');
      return guardada ? JSON.parse(guardada) : CONFIG_IA_DEFAULT;
    } catch {
      return CONFIG_IA_DEFAULT;
    }
  });

  const handleGuardarConfigIA = (nueva: ConfiguracionIAMiniRey) => {
    setConfigIA(nueva);
    try {
      localStorage.setItem('innmex_config_ia', JSON.stringify(nueva));
    } catch (e) {
      console.warn('No se pudo guardar config en localStorage:', e);
    }
    mostrarAlerta('✓ Ajustes de IA y Modelo guardados exitosamente.');
    setModalAjustesAbierto(false);
  };

  // Estados del generador de catálogo dentro del asistente
  const [promptCatIA, setPromptCatIA] = useState('');
  const [generandoCatIA, setGenerandoCatIA] = useState(false);
  const [articulosCatGenerados, setArticulosCatGenerados] = useState<Omit<Articulo, 'id'>[]>([]);
  const [guardandoCat, setGuardandoCat] = useState(false);

  // Estados para herramienta de Audio Inteligente
  const [audioEntorno, setAudioEntorno] = useState<'domestico' | 'comercial' | 'industrial'>('domestico');
  const [audioZonas, setAudioZonas] = useState<number>(3);
  const [audioMetrosCuadrados, setAudioMetrosCuadrados] = useState<number>(180);
  const [audioIncluirExterior, setAudioIncluirExterior] = useState<boolean>(true);

  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: 'msg-init-1',
      remitente: 'ia',
      texto: `¡Saludos! Soy **Ingeniero Virtual 40** (40 años de edad simulada), consultor técnico virtual especializado en proyectos de infraestructura tecnológica, seguridad y audio inteligente en **INNMEX SOLUCIONES**.

Cuento con 20 años de experiencia técnica en:
• **Tecnologías de Comunicación de Redes (Voz y Datos)**: Switches gestionables Cisco PoE+, routing, segmentación de VLANs y telefonía IP Yealink.
• **Sistemas de Videovigilancia CCTV**: Dimensionamiento de cámaras IP 4K de alta definición, NVRs y cálculo de almacenamiento en discos WD Purple para 30 a 60 días continuos.
• **Ingeniería en Sonido y Sistemas de Audio Inteligentes (Doméstico, Comercial e Industrial)**: Audio multizona Hi-Fi, altavoces de plafón 70V/100V, amplificación streaming multihabitación y megafonía/voceo IP de emergencia.
• **Lectura de Planos Arquitectónicos y Fundamentos de Ingeniería Civil**: Rutas óptimas de canalización en tubería Conduit EMT, pases de losa, ubicación de gabinetes de pared e integración con obras civiles.
• **Diseño y Cotizaciones Realistas**: Alternativas técnicas según espacio, presupuesto y escalabilidad.

Acompaño tu proyecto desde la planeación hasta la cotización formal. ¿En qué plano arquitectónico o requerimiento tecnológico trabajamos hoy?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sugerencias: [
        '🎵 Audio Multizona Residencial (Casa 3 zonas con terraza)',
        '🔊 Sistema de Megafonía y Voceo para Planta Industrial',
        '📹 Dimensionar paquete de 8 Cámaras 4K CCTV con NVR y disco',
        '📐 Cableado y ductería para casa de 2 pisos (220 m²)'
      ],
      acciones: [
        {
          tipo: 'crear_paquete',
          titulo: 'Paquete de Inicio Recomendado: Videovigilancia CCTV 4K Pro',
          descripcion: '4 Cámaras IP 4K 8MP + NVR 16P PoE + Disco 8TB + Bobina UTP Cat6A',
          items: [
            { sku: 'CAM-CCTV-4KIP', nombre: 'Cámara IP 4K 8MP Ultra HD PoE IR 40m', cantidad: 4, precioUnitario: 125.0 },
            { sku: 'NVR-HIK-16P4K', nombre: 'Grabador NVR 16 Canales 4K PoE', cantidad: 1, precioUnitario: 480.0 },
            { sku: 'HDD-WD-PURPLE8T', nombre: 'Disco Duro WD Purple Pro 8TB 24/7', cantidad: 1, precioUnitario: 240.0 },
            { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: 1, precioUnitario: 215.0 }
          ],
          descuentoSugerido: 5,
          datosTecnicos: { camaras: 4, diasGrabacion: 60, discoTB: 8, metrosCable: 305 }
        }
      ]
    }
  ]);

  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estados de la herramienta Asistente Dimensionador CCTV
  const [cctvNumCamaras, setCctvNumCamaras] = useState<number>(8);
  const [cctvDiasGrabacion, setCctvDiasGrabacion] = useState<number>(30);
  const [cctvIncluirConduit, setCctvIncluirConduit] = useState<boolean>(true);

  // Estados de la herramienta Asistente Planos y Cableado
  const [planosMetrosCuadrados, setPlanosMetrosCuadrados] = useState<number>(180);
  const [planosNiveles, setPlanosNiveles] = useState<number>(2);
  const [planosPuntosRed, setPlanosPuntosRed] = useState<number>(10);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, cargando]);

  const mostrarAlerta = (mensaje: string) => {
    setAlertaAccion(mensaje);
    setTimeout(() => {
      setAlertaAccion(null);
    }, 3500);
  };

  // Función para que el Asistente agregue paquetes o ítems al carrito
  const handleEjecutarAccion = (accion: AccionPropuesta) => {
    if (!onAgregarAlCarrito || !accion.items || accion.items.length === 0) return;

    let agregados = 0;
    accion.items.forEach(itemProp => {
      const artEncontrado = articulos.find(a => a.sku === itemProp.sku) || {
        id: `gen-${itemProp.sku}`,
        sku: itemProp.sku,
        nombre: itemProp.nombre,
        descripcion: `Equipo recomendado por Mini Rey IA para ${accion.titulo}`,
        categoria: 'Soluciones Mini Rey IA',
        precio: itemProp.precioUnitario,
        stock: 50,
        unidad: 'unidad'
      };

      onAgregarAlCarrito(artEncontrado, itemProp.cantidad);
      agregados += itemProp.cantidad;
    });

    mostrarAlerta(`✓ Mini Rey IA agregó ${agregados} artículo(s) al Carrito de Cotización.`);
  };

  // Función para registrar equipos recomendados directamente en el catálogo oficial
  const handleRegistrarEnCatalogo = async (accion: AccionPropuesta) => {
    if (!onGuardarArticulo || !accion.items || accion.items.length === 0) return;

    let guardados = 0;
    for (const it of accion.items) {
      const yaExiste = articulos.some(a => a.sku === it.sku);
      if (!yaExiste) {
        await onGuardarArticulo({
          sku: it.sku,
          nombre: it.nombre,
          descripcion: `Ficha técnica de ingeniería generada por Mini Rey IA para ${accion.titulo}`,
          categoria: 'Equipos Técnicos',
          precio: it.precioUnitario,
          stock: 25,
          unidad: 'unidad',
          imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80'
        });
        guardados++;
      }
    }

    mostrarAlerta(`✓ Se registraron ${guardados || accion.items.length} artículo(s) en el Catálogo Oficial del ERP.`);
  };

  // Generador de artículos para catálogo desde la pestaña
  const handleGenerarArticulosCatalogoIA = async () => {
    if (!promptCatIA.trim() || generandoCatIA) return;
    setGenerandoCatIA(true);

    try {
      const res = await fetch('/api/articulos/generar-con-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptCatIA.trim(), cantidad: 3 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.articulosGenerados) {
          setArticulosCatGenerados(data.articulosGenerados);
        }
      }
    } catch (e) {
      console.warn('Error generando con IA:', e);
    } finally {
      setGenerandoCatIA(false);
    }
  };

  const handleGuardarArticuloCatalogoIndividual = async (art: Omit<Articulo, 'id'>, index: number) => {
    if (!onGuardarArticulo) return;
    setGuardandoCat(true);
    try {
      await onGuardarArticulo(art);
      setArticulosCatGenerados(prev => prev.filter((_, i) => i !== index));
      mostrarAlerta(`✓ Artículo "${art.nombre}" guardado en Catálogo.`);
    } finally {
      setGuardandoCat(false);
    }
  };

  const enviarMensaje = async (textoAEnviar?: string) => {
    const texto = textoAEnviar || inputTexto;
    if (!texto.trim() || cargando) return;

    const nuevoMensajeUsuario: MensajeChat = {
      id: `usr-${Date.now()}`,
      remitente: 'usuario',
      texto: texto.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputTexto('');
    setCargando(true);

    try {
      const response = await fetch('/api/ia/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pregunta: texto.trim(),
          modelo: configIA.modeloCloud,
          temperatura: configIA.temperatura,
          modo: configIA.proveedorActivo,
          endpointLocal: configIA.endpointLocal,
          localModelName: configIA.modeloLocalSeleccionado,
          contexto: {
            asistente: 'Mini Rey IA (Ingeniero Virtual 40)',
            totalArticulosCatalogo: articulos.length,
            articulosEnCarrito: carrito.map(c => ({ sku: c.sku, nombre: c.nombre, cantidad: c.cantidad, subtotal: c.subtotal }))
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const nuevoMensajeIA: MensajeChat = {
        id: `ia-${Date.now()}`,
        remitente: 'ia',
        texto: data.respuesta || 'He procesado tu consulta pero no se generó texto de respuesta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        acciones: data.acciones || []
      };

      setMensajes(prev => [...prev, nuevoMensajeIA]);
    } catch (error) {
      console.error('Error enviando mensaje a Mini Rey IA:', error);
      const nuevoMensajeError: MensajeChat = {
        id: `err-${Date.now()}`,
        remitente: 'ia',
        texto: 'Hubo un inconveniente al conectar con el motor de IA. Puedes intentar nuevamente o usar las herramientas interactivas del asistente en la barra superior.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMensajes(prev => [...prev, nuevoMensajeError]);
    } finally {
      setCargando(false);
    }
  };

  const handleLimpiarChat = () => {
    setMensajes([
      {
        id: 'msg-init-reset',
        remitente: 'ia',
        texto: 'Sesión reiniciada. Soy **Mini Rey IA (Ingeniero Virtual 40)**. ¿Qué proyecto de redes, CCTV, lectura de planos o cotización evaluamos ahora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Cálculos de la herramienta Asistente CCTV
  const calcularSolucionCCTV = () => {
    // Estimación técnica: cada cámara 4K H.265+ usa ~12GB/día
    const gbPorDia = cctvNumCamaras * 12;
    const gbTotales = gbPorDia * cctvDiasGrabacion;
    const tbRequeridos = Math.ceil(gbTotales / 1000);
    const discosRequeridos = Math.max(1, Math.ceil(tbRequeridos / 8)); // discos WD Purple 8TB
    const bobinasUtp = Math.max(1, Math.ceil((cctvNumCamaras * 35) / 305)); // promedio 35m por tiro
    const tramosConduit = cctvIncluirConduit ? Math.ceil((cctvNumCamaras * 15) / 3) : 0; // tramos de 3m

    const items: { sku: string; nombre: string; cantidad: number; precioUnitario: number }[] = [
      { sku: 'CAM-CCTV-4KIP', nombre: 'Cámara IP 4K 8MP Ultra HD PoE IR 40m', cantidad: cctvNumCamaras, precioUnitario: 125.0 },
      { sku: 'NVR-HIK-16P4K', nombre: 'Grabador NVR 16 Canales 4K PoE', cantidad: 1, precioUnitario: 480.0 },
      { sku: 'HDD-WD-PURPLE8T', nombre: 'Disco Duro Western Digital Purple Pro 8TB', cantidad: discosRequeridos, precioUnitario: 240.0 },
      { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m', cantidad: bobinasUtp, precioUnitario: 215.0 }
    ];

    if (tramosConduit > 0) {
      items.push({
        sku: 'CAN-COND-EMT34',
        nombre: 'Tubería Conduit Galvanizada EMT 3/4" x 3m',
        cantidad: tramosConduit,
        precioUnitario: 18.5
      });
    }

    const subtotal = items.reduce((acc, curr) => acc + (curr.cantidad * curr.precioUnitario), 0);

    return {
      tbRequeridos,
      discosRequeridos,
      bobinasUtp,
      tramosConduit,
      items,
      subtotal
    };
  };

  // Cálculos de la herramienta Asistente Planos & Redes
  const calcularSolucionPlanos = () => {
    // Estimación técnica: 1 AP WiFi 6 por cada 120-140m² o por piso
    const apsNecesarios = Math.max(planosNiveles, Math.ceil(planosMetrosCuadrados / 120));
    // Tiros promedio por punto de red: 28 metros en casa
    const metrosTotalesCable = planosPuntosRed * 28;
    const bobinasUtp = Math.max(1, Math.ceil(metrosTotalesCable / 305));
    // Tubería conduit: 8 metros por punto
    const tramosConduit = Math.ceil((planosPuntosRed * 8) / 3);

    const items = [
      { sku: 'SW-CISCO-C9200', nombre: 'Switch Cisco Catalyst C9200L 24P PoE+', cantidad: 1, precioUnitario: 1980.0 },
      { sku: 'AP-UNIFI-U6PRO', nombre: 'Punto de Acceso Ubiquiti UniFi U6 Pro WiFi 6', cantidad: apsNecesarios, precioUnitario: 175.0 },
      { sku: 'RAC-WALL-12U', nombre: 'Gabinete de Pared 12U Abatible para Telecom', cantidad: 1, precioUnitario: 195.0 },
      { sku: 'CAB-UTP-CAT6A', nombre: 'Carrete Cable UTP Cat6A 305m 100% Cobre', cantidad: bobinasUtp, precioUnitario: 215.0 },
      { sku: 'CAN-COND-EMT34', nombre: 'Tubería Conduit Galvanizada EMT 3/4" x 3m', cantidad: tramosConduit, precioUnitario: 18.5 },
      { sku: 'SRV-INST-CONF', nombre: 'Servicio de Configuración e Implementación VLANs', cantidad: 1, precioUnitario: 450.0 }
    ];

    const subtotal = items.reduce((acc, curr) => acc + (curr.cantidad * curr.precioUnitario), 0);

    return {
      apsNecesarios,
      metrosTotalesCable,
      bobinasUtp,
      tramosConduit,
      items,
      subtotal
    };
  };

  // Cálculos de la herramienta Asistente de Audio Inteligente
  const calcularSolucionAudio = () => {
    const amplificadoresReq = Math.max(1, Math.ceil(audioZonas / 4));
    const paresPlafon = Math.max(audioZonas, Math.ceil((audioMetrosCuadrados * 0.75) / 35));
    const paresExterior = audioIncluirExterior ? (audioEntorno === 'industrial' ? Math.max(2, Math.ceil(audioZonas * 1.5)) : 1) : 0;
    const bobinasCable = Math.max(1, Math.ceil((audioZonas * 50) / 305));

    const items: { sku: string; nombre: string; cantidad: number; precioUnitario: number }[] = [
      {
        sku: 'AUD-AMP-MULTI4',
        nombre: 'Amplificador Inteligente Multizona Streaming 4 Zonas Hi-Fi',
        cantidad: amplificadoresReq,
        precioUnitario: 890.0
      },
      {
        sku: 'AUD-SPK-CEIL6',
        nombre: 'Par de Altavoces Coaxiales de Plafón 6.5" 70V/100V & 8Ω',
        cantidad: paresPlafon,
        precioUnitario: 145.0
      }
    ];

    if (paresExterior > 0) {
      items.push({
        sku: 'AUD-SPK-EXT8',
        nombre: 'Par de Bafles de Intemperie IP66 para Terrazas e Industria',
        cantidad: paresExterior,
        precioUnitario: 230.0
      });
    }

    if (audioEntorno === 'comercial' || audioEntorno === 'industrial') {
      items.push({
        sku: 'AUD-MIC-PAGING',
        nombre: 'Estación de Voceo y Micrófono Cuello de Ganso IP',
        cantidad: 1,
        precioUnitario: 310.0
      });
    }

    items.push({
      sku: 'CAB-UTP-CAT6A',
      nombre: 'Carrete Cable UTP Cat6A 305m (Control y Streaming)',
      cantidad: bobinasCable,
      precioUnitario: 215.0
    });

    items.push({
      sku: 'SRV-INST-CONF',
      nombre: 'Servicio de Configuración, Calibración Acústica y Zonas',
      cantidad: 1,
      precioUnitario: 450.0
    });

    const subtotal = items.reduce((acc, curr) => acc + (curr.cantidad * curr.precioUnitario), 0);

    return {
      amplificadoresReq,
      paresPlafon,
      paresExterior,
      bobinasCable,
      items,
      subtotal
    };
  };

  const resultadoCCTV = calcularSolucionCCTV();
  const resultadoPlanos = calcularSolucionPlanos();
  const resultadoAudio = calcularSolucionAudio();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[680px] bg-[#0d0d0d] rounded-2xl border border-[#1a1a1a] shadow-2xl overflow-hidden relative">
      
      {/* Alerta flotante cuando el asistente agrega al carrito */}
      {alertaAccion && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#161616] text-[#c5a059] border border-[#c5a059]/60 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2.5 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#c5a059]" />
          <span>{alertaAccion}</span>
          {onAbrirCarrito && (
            <button 
              onClick={onAbrirCarrito}
              className="ml-2 underline text-white hover:text-[#c5a059]"
            >
              Ver Carrito
            </button>
          )}
        </div>
      )}

      {/* Header Principal con Perfil de Ingeniero Virtual 40 */}
      <div className="bg-[#111111] text-white p-3.5 sm:p-4 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/60 flex items-center justify-center p-1 shadow-lg">
              <img 
                src="/innmex_logo.png" 
                alt="Mini Rey IA" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#111] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif italic font-bold text-sm sm:text-base text-white tracking-wide">
                Ingeniero Virtual 40
              </h2>
              <span className="bg-[#1a1a1a] text-[#c5a059] text-[10px] px-2 py-0.5 rounded-full border border-[#c5a059]/40 font-mono">
                Consultor Técnico
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-400">
              Redes (Voz y Datos), CCTV, Audio Inteligente y Planos Civiles • INNMEX SOLUCIONES
            </p>
          </div>
        </div>

        {/* Acciones de cabecera */}
        <div className="flex items-center space-x-2">
          
          {/* Badge del modelo activo */}
          <button
            onClick={() => setModalAjustesAbierto(true)}
            className="hidden md:inline-flex items-center space-x-1.5 bg-black/60 hover:bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/40 text-[11px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
            title="Ver / Cambiar Motor de IA y Modelos Locales"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {configIA.proveedorActivo === 'local_ollama' 
                ? `Local: ${MODELOS_LOCALES_CATALOGO.find(m => m.id === configIA.modeloLocalSeleccionado)?.nombre || 'Ollama'}`
                : `Cloud: ${configIA.modeloCloud}`}
            </span>
          </button>

          {/* Botón Ajustes de IA */}
          <button
            onClick={() => setModalAjustesAbierto(true)}
            className="inline-flex items-center space-x-1.5 bg-[#161616] hover:bg-[#222] text-[#c5a059] border border-[#c5a059]/40 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            title="Ajustes de Modelo e IA Local"
          >
            <Settings className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Ajustes & Modelos</span>
          </button>

          {onAbrirCarrito && (
            <button
              onClick={onAbrirCarrito}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-[#161616] hover:bg-[#202020] text-[#c5a059] border border-[#c5a059]/30 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              title="Abrir Carrito de Cotización"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Carrito ({carrito.length})</span>
            </button>
          )}

          <button
            onClick={handleLimpiarChat}
            className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            title="Reiniciar conversación con Mini Rey IA"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de Herramientas de Asistente (Selector de Modos Activos) */}
      <div className="bg-[#0a0a0a] px-3 py-2 border-b border-[#1a1a1a] flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-[#c5a059] font-bold shrink-0 flex items-center space-x-1 mr-1">
          <Wrench className="w-3 h-3 text-[#c5a059]" />
          <span>Funciones de Agente:</span>
        </span>

        <button
          onClick={() => setPestanaActiva('chat')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'chat'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Chat de Consultoría</span>
        </button>

        <button
          onClick={() => setPestanaActiva('dimensionador_cctv')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'dimensionador_cctv'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Dimensionador CCTV 4K</span>
        </button>

        <button
          onClick={() => setPestanaActiva('calculador_planos')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'calculador_planos'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Calculador Planos & Redes</span>
        </button>

        <button
          onClick={() => setPestanaActiva('dimensionador_audio')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'dimensionador_audio'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Audio Inteligente & Sonido</span>
        </button>

        <button
          onClick={() => setPestanaActiva('creador_catalogo')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'creador_catalogo'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Crear Artículos Catálogo</span>
        </button>

        <button
          onClick={() => setPestanaActiva('ajustes_modelos')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            pestanaActiva === 'ajustes_modelos'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-[#141414]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Modelos Locales & Ajustes</span>
        </button>
      </div>

      {/* CONTENIDO SEGÚN MODO SELECCIONADO */}

      {/* 1. MODO: DIMENSIONADOR ASISTENTE CCTV */}
      {pestanaActiva === 'dimensionador_cctv' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a] space-y-5">
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#1a1a1a]">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/50 text-[#c5a059] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-white text-base">
                  Herramienta de Asistente: Dimensionador de Videovigilancia CCTV
                </h3>
                <p className="text-xs text-stone-400">
                  Cálculo técnico de cámaras, canales PoE, capacidad de almacenamiento y ductería civil.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1a1a1a]">
              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Número de Cámaras 4K:
                </label>
                <select
                  value={cctvNumCamaras}
                  onChange={(e) => setCctvNumCamaras(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value={4}>4 Cámaras (Residencial básica)</option>
                  <option value={8}>8 Cámaras (Casa mediana / Local)</option>
                  <option value={12}>12 Cámaras (Empresa / Bodega)</option>
                  <option value={16}>16 Cámaras (Edificio / Planta)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Días de Grabación Continua:
                </label>
                <select
                  value={cctvDiasGrabacion}
                  onChange={(e) => setCctvDiasGrabacion(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value={15}>15 Días continuos</option>
                  <option value={30}>30 Días continuos (Estándar)</option>
                  <option value={60}>60 Días continuos (Alta retención)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Canalización Tubería Conduit EMT:
                </label>
                <select
                  value={cctvIncluirConduit ? 'si' : 'no'}
                  onChange={(e) => setCctvIncluirConduit(e.target.value === 'si')}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value="si">Incluir Tramos EMT 3/4" (Exterior/Muros)</option>
                  <option value="no">Sin Tubería (Solo cableado UTP)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resultado del Dimensionamiento Técnico */}
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#c5a059]/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                Dictamen de Ingeniería Virtual 40:
              </span>
              <span className="text-sm font-serif font-bold text-white">
                Subtotal Estimado: <span className="text-[#c5a059]">{formatearMoneda(resultadoCCTV.subtotal)}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Cámaras 4K</span>
                <span className="text-lg font-bold text-white">{cctvNumCamaras} Domos/Balas</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Almacenamiento</span>
                <span className="text-lg font-bold text-[#c5a059]">{resultadoCCTV.tbRequeridos} TB ({resultadoCCTV.discosRequeridos}x WD Purple 8TB)</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Bobinas Cat6A</span>
                <span className="text-lg font-bold text-white">{resultadoCCTV.bobinasUtp} ({resultadoCCTV.bobinasUtp * 305} metros)</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Tubería EMT 3/4"</span>
                <span className="text-lg font-bold text-white">{resultadoCCTV.tramosConduit} tramos (3m c/u)</span>
              </div>
            </div>

            {/* Lista de equipos calculados */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-stone-400 uppercase block">Equipos incluidos en la propuesta:</span>
              <div className="divide-y divide-[#1a1a1a] bg-black/40 rounded-xl p-3 border border-[#1a1a1a]">
                {resultadoCCTV.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[#c5a059] font-bold mr-2">{item.sku}</span>
                      <span className="text-stone-200">{item.nombre}</span>
                      <span className="text-stone-400 ml-2">x {item.cantidad}</span>
                    </div>
                    <span className="font-serif font-bold text-white">
                      {formatearMoneda(item.cantidad * item.precioUnitario)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Ejecución de Agente */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Solución CCTV 4K (${cctvNumCamaras} Cámaras - ${cctvDiasGrabacion} Días)`,
                    items: resultadoCCTV.items
                  });
                }}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir Solución al Carrito de Cotización</span>
              </button>

              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Solución CCTV 4K (${cctvNumCamaras} Cámaras)`,
                    items: resultadoCCTV.items
                  });
                  onIrACotizacion();
                }}
                className="inline-flex items-center space-x-2 bg-[#181818] hover:bg-[#222] text-white border border-[#2a2a2a] text-xs sm:text-sm py-3 px-4 rounded-xl transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Ir Directo a Presupuesto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODO: CALCULADOR DE PLANOS Y REDES */}
      {pestanaActiva === 'calculador_planos' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a] space-y-5">
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#1a1a1a]">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/50 text-[#c5a059] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-white text-base">
                  Herramienta de Asistente: Lector de Planos & Redes Estructuradas
                </h3>
                <p className="text-xs text-stone-400">
                  Interpretación de dimensiones de casas y edificios para calcular tiros de UTP, tubería conduit y WiFi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1a1a1a]">
              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Área Total de Construcción (m²):
                </label>
                <input
                  type="number"
                  min={50}
                  max={2000}
                  step={10}
                  value={planosMetrosCuadrados}
                  onChange={(e) => setPlanosMetrosCuadrados(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Número de Niveles / Pisos:
                </label>
                <select
                  value={planosNiveles}
                  onChange={(e) => setPlanosNiveles(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value={1}>1 Planta / Nivel</option>
                  <option value={2}>2 Plantas (Casa / Dúplex)</option>
                  <option value={3}>3 Plantas (Residencia / Oficina)</option>
                  <option value={4}>4 Plantas o más</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Puntos de Red Requeridos (Voz/Datos):
                </label>
                <input
                  type="number"
                  min={2}
                  max={96}
                  value={planosPuntosRed}
                  onChange={(e) => setPlanosPuntosRed(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resultado del Cálculo de Planos */}
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#c5a059]/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                Recomendación de Infraestructura Civil & Red:
              </span>
              <span className="text-sm font-serif font-bold text-white">
                Subtotal Estimado: <span className="text-[#c5a059]">{formatearMoneda(resultadoPlanos.subtotal)}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Puntos WiFi 6</span>
                <span className="text-lg font-bold text-white">{resultadoPlanos.apsNecesarios} AP UniFi U6</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Cable UTP Cat6A</span>
                <span className="text-lg font-bold text-[#c5a059]">{resultadoPlanos.bobinasUtp} Bobina(s) ({resultadoPlanos.metrosTotalesCable} m calculados)</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Tubería Conduit EMT</span>
                <span className="text-lg font-bold text-white">{resultadoPlanos.tramosConduit} tramos x 3m</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Rack de Pared</span>
                <span className="text-lg font-bold text-white">Gabinete 12U</span>
              </div>
            </div>

            {/* Lista de equipos calculados */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-stone-400 uppercase block">Materiales y equipos sugeridos:</span>
              <div className="divide-y divide-[#1a1a1a] bg-black/40 rounded-xl p-3 border border-[#1a1a1a]">
                {resultadoPlanos.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[#c5a059] font-bold mr-2">{item.sku}</span>
                      <span className="text-stone-200">{item.nombre}</span>
                      <span className="text-stone-400 ml-2">x {item.cantidad}</span>
                    </div>
                    <span className="font-serif font-bold text-white">
                      {formatearMoneda(item.cantidad * item.precioUnitario)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Ejecución de Agente */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Infraestructura Red y Planos (${planosMetrosCuadrados} m² - ${planosNiveles} Pisos)`,
                    items: resultadoPlanos.items
                  });
                }}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir Infraestructura al Carrito</span>
              </button>

              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Infraestructura Red y Planos (${planosMetrosCuadrados} m²)`,
                    items: resultadoPlanos.items
                  });
                  onIrACotizacion();
                }}
                className="inline-flex items-center space-x-2 bg-[#181818] hover:bg-[#222] text-white border border-[#2a2a2a] text-xs sm:text-sm py-3 px-4 rounded-xl transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Ir Directo a Presupuesto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODO: DIMENSIONADOR DE AUDIO INTELIGENTE (DOMÉSTICO, COMERCIAL E INDUSTRIAL) */}
      {pestanaActiva === 'dimensionador_audio' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a] space-y-5">
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#1a1a1a] space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/50 text-[#c5a059] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-white text-base">
                  Herramienta de Asistente: Dimensionador de Audio Inteligente
                </h3>
                <p className="text-xs text-stone-400">
                  Ingeniería acústica para sistemas multizona domésticos, comerciales (restaurantes/tiendas) e industriales (voceo/emergencia).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#1a1a1a]">
              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Tipo de Entorno / Aplicación:
                </label>
                <select
                  value={audioEntorno}
                  onChange={(e) => setAudioEntorno(e.target.value as any)}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value="domestico">🏡 Doméstico (Residencial Multi-room)</option>
                  <option value="comercial">🏪 Comercial (Restaurante / Oficina / Tienda)</option>
                  <option value="industrial">🏭 Industrial (Nave / Bodega / Megafonía)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Número de Zonas de Audio:
                </label>
                <select
                  value={audioZonas}
                  onChange={(e) => setAudioZonas(Number(e.target.value))}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value={1}>1 Zona (Sonido uniforme)</option>
                  <option value={2}>2 Zonas (ej. Interior y Terraza)</option>
                  <option value={3}>3 Zonas (ej. Sala, Comedor, Jardín)</option>
                  <option value={4}>4 Zonas (Matriz completa)</option>
                  <option value={6}>6 Zonas (Multizona extendida)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-stone-300 block mb-1.5">
                  Área Exterior / Intemperie IP66:
                </label>
                <select
                  value={audioIncluirExterior ? 'si' : 'no'}
                  onChange={(e) => setAudioIncluirExterior(e.target.value === 'si')}
                  className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs focus:border-[#c5a059] outline-none"
                >
                  <option value="si">Incluir Bafles IP66 Intemperie</option>
                  <option value="no">Solo Altavoces Interiores</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resultado del Cálculo de Audio */}
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#c5a059]/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                Propuesta de Ingeniería en Sonido ({audioEntorno.toUpperCase()}):
              </span>
              <span className="text-sm font-serif font-bold text-white">
                Subtotal Estimado: <span className="text-[#c5a059]">{formatearMoneda(resultadoAudio.subtotal)}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Amplificación</span>
                <span className="text-lg font-bold text-white">{resultadoAudio.amplificadoresReq} Matriz 4Z Hi-Fi</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Altavoces Plafón</span>
                <span className="text-lg font-bold text-[#c5a059]">{resultadoAudio.paresPlafon} Pares Coaxiales</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Altavoces Exterior</span>
                <span className="text-lg font-bold text-white">{resultadoAudio.paresExterior} Pares IP66</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-[#1a1a1a]">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Cableado y Zonas</span>
                <span className="text-lg font-bold text-white">{audioZonas} Zonas Audio</span>
              </div>
            </div>

            {/* Desglose de Equipos */}
            <div className="bg-black/40 p-4 rounded-xl border border-[#1a1a1a] space-y-2">
              <span className="text-[11px] font-mono uppercase text-stone-400 block mb-2">
                Partidas calculadas por el Ingeniero Virtual 40:
              </span>
              <div className="divide-y divide-[#1f1f1f]">
                {resultadoAudio.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-[#c5a059] mr-2">{item.sku}</span>
                      <span className="text-white font-medium">{item.nombre}</span>
                      <span className="text-stone-400 ml-2">x{item.cantidad}</span>
                    </div>
                    <span className="font-serif font-bold text-white">
                      {formatearMoneda(item.cantidad * item.precioUnitario)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Ejecución */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Sistema de Audio Inteligente (${audioEntorno} - ${audioZonas} Zonas)`,
                    items: resultadoAudio.items
                  });
                }}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir Sistema de Audio al Carrito</span>
              </button>

              <button
                onClick={() => {
                  handleEjecutarAccion({
                    tipo: 'crear_paquete',
                    titulo: `Sistema de Audio Inteligente (${audioEntorno})`,
                    items: resultadoAudio.items
                  });
                  onIrACotizacion();
                }}
                className="inline-flex items-center space-x-2 bg-[#181818] hover:bg-[#222] text-white border border-[#2a2a2a] text-xs sm:text-sm py-3 px-4 rounded-xl transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Ir Directo a Presupuesto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODO: CREADOR DE ARTÍCULOS PARA EL CATÁLOGO CON MINI REY IA */}
      {pestanaActiva === 'creador_catalogo' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a] space-y-5">
          <div className="bg-[#111111] p-5 rounded-2xl border border-[#1a1a1a] space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/50 text-[#c5a059] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-white text-base">
                  Herramienta de Asistente: Creador de Fichas para el Catálogo
                </h3>
                <p className="text-xs text-stone-400">
                  Pídele a Mini Rey IA que diseñe fichas técnicas completas para nuevos artículos e incorpóralos al inventario ERP.
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <label className="text-[11px] font-mono uppercase text-stone-300 block">
                Describe los productos a incorporar:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={promptCatIA}
                  onChange={(e) => setPromptCatIA(e.target.value)}
                  placeholder="Ej: Cámaras domo PTZ 360°, bobinas de fibra óptica monomodo o lector facial ZKTeco..."
                  className="flex-1 bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-xs focus:border-[#c5a059] outline-none placeholder:text-stone-500"
                />
                <button
                  type="button"
                  onClick={handleGenerarArticulosCatalogoIA}
                  disabled={!promptCatIA.trim() || generandoCatIA}
                  className="bg-[#c5a059] hover:bg-[#d4b068] disabled:bg-[#222] disabled:text-stone-500 text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generandoCatIA ? 'Diseñando fichas...' : 'Generar Fichas'}</span>
                </button>
              </div>

              {/* Botón rápido para saltar al Catálogo */}
              <div className="pt-1 flex items-center justify-between text-xs text-stone-400">
                <span>Catálogo actual: {articulos.length} productos registrados</span>
                <button
                  type="button"
                  onClick={onIrABusqueda}
                  className="text-[#c5a059] hover:underline flex items-center space-x-1 text-[11px]"
                >
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Fichas Generadas */}
          {articulosCatGenerados.length > 0 && (
            <div className="bg-[#111111] p-5 rounded-2xl border border-[#c5a059]/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider">
                  Fichas Diseñadas por Mini Rey IA ({articulosCatGenerados.length}):
                </span>
                {onGuardarArticulosEnLote && (
                  <button
                    type="button"
                    onClick={async () => {
                      setGuardandoCat(true);
                      try {
                        await onGuardarArticulosEnLote(articulosCatGenerados);
                        setArticulosCatGenerados([]);
                        mostrarAlerta(`✓ Se agregaron ${articulosCatGenerados.length} artículos al Catálogo Oficial.`);
                      } finally {
                        setGuardandoCat(false);
                      }
                    }}
                    disabled={guardandoCat}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow"
                  >
                    + Agregar Todos al Catálogo
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {articulosCatGenerados.map((art, idx) => (
                  <div key={idx} className="bg-black/60 p-3.5 rounded-xl border border-[#1f1f1f] flex flex-col sm:flex-row gap-3">
                    <div className="w-14 h-14 rounded-xl bg-black border border-[#c5a059]/30 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                      <img src={art.imagenUrl} alt={art.nombre} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[#c5a059] text-xs font-bold">{art.sku}</span>
                            <span className="bg-[#1c1c1c] text-stone-300 text-[9px] px-1.5 py-0.5 rounded font-mono border border-[#333]">
                              {art.categoria}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-white mt-0.5">{art.nombre}</h4>
                        </div>
                        <span className="font-serif font-bold text-white text-sm">
                          {formatearMoneda(art.precio)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 line-clamp-2">{art.descripcion}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 font-mono">Stock: {art.stock} {art.unidad}</span>
                        <button
                          type="button"
                          onClick={() => handleGuardarArticuloCatalogoIndividual(art, idx)}
                          disabled={guardandoCat}
                          className="bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-[10px] py-1 px-3 rounded-lg flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Guardar en Catálogo</span>
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

      {/* 5. MODO: AJUSTES DE MODELOS IA & DESCARGAS DIRECTAS GGUF */}
      {pestanaActiva === 'ajustes_modelos' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0a0a]">
          <AjustesModelosIA
            config={configIA}
            onGuardarConfig={handleGuardarConfigIA}
          />
        </div>
      )}

      {/* MODAL FLOTANTE DE AJUSTES (ACCESIBLE DESDE CUALQUIER MODO) */}
      {modalAjustesAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0e0e0e] border border-[#2a2a2a] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
            <div className="bg-[#141414] px-5 py-3 border-b border-[#222] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configuración de Motor de IA & Descarga de Modelos Locales</span>
              </span>
              <button
                onClick={() => setModalAjustesAbierto(false)}
                className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-[#222] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AjustesModelosIA
                config={configIA}
                onGuardarConfig={handleGuardarConfigIA}
                onCerrar={() => setModalAjustesAbierto(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. MODO: CHAT PRINCIPAL CON MINI REY IA Y ACCIONES EJECUTABLES */}
      {pestanaActiva === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
            {mensajes.map((msg) => {
              const esIA = msg.remitente === 'ia';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 max-w-[94%] sm:max-w-[85%] ${
                    esIA ? 'self-start' : 'self-end ml-auto flex-row-reverse space-x-reverse'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    esIA 
                      ? 'bg-black border border-[#c5a059]/50 text-[#c5a059] p-0.5' 
                      : 'bg-[#c5a059] text-black font-semibold'
                  }`}>
                    {esIA ? (
                      <img 
                        src="/innmex_logo.png" 
                        alt="Mini Rey IA" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-2 w-full">
                    <div className={`p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed ${
                      esIA 
                        ? 'bg-[#111111] text-[#e0e0e0] border border-[#1a1a1a] shadow-sm rounded-tl-sm' 
                        : 'bg-[#1c1c1c] text-white border border-[#2a2a2a] rounded-tr-sm shadow-md'
                    }`}>
                      <div className="whitespace-pre-line font-sans">
                        {msg.texto}
                      </div>

                      {/* TARJETAS DE ACCIÓN DE ASISTENTE EN EL MENSAJE */}
                      {msg.acciones && msg.acciones.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-[#1f1f1f] space-y-3">
                          {msg.acciones.map((acc, aIdx) => (
                            <div key={aIdx} className="bg-black/70 p-3.5 rounded-xl border border-[#c5a059]/40 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-serif italic font-bold text-white text-xs flex items-center space-x-1.5">
                                  <Package className="w-3.5 h-3.5 text-[#c5a059]" />
                                  <span>{acc.titulo}</span>
                                </span>
                                {acc.descuentoSugerido && (
                                  <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-800/60">
                                    Descuento {acc.descuentoSugerido}% Aplicable
                                  </span>
                                )}
                              </div>

                              {acc.descripcion && (
                                <p className="text-[11px] text-stone-400">{acc.descripcion}</p>
                              )}

                              {/* Items list */}
                              {acc.items && (
                                <div className="space-y-1.5 divide-y divide-[#1a1a1a] pt-1">
                                  {acc.items.map((it, iIdx) => (
                                    <div key={iIdx} className="pt-1.5 flex justify-between text-[11px]">
                                      <span className="text-stone-300">
                                        <strong className="text-[#c5a059] font-mono">{it.sku}</strong> • {it.nombre} x{it.cantidad}
                                      </span>
                                      <span className="font-serif font-bold text-white">
                                        {formatearMoneda(it.cantidad * it.precioUnitario)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Botón de Asistente para agregar a Carrito y Guardar en Catálogo */}
                              <div className="pt-2 flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => handleEjecutarAccion(acc)}
                                  className="flex-1 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-[11px] py-2 px-3 rounded-lg shadow transition-all flex items-center justify-center space-x-1.5"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Añadir al Carrito</span>
                                </button>
                                
                                {onGuardarArticulo && (
                                  <button
                                    onClick={() => handleRegistrarEnCatalogo(acc)}
                                    className="bg-[#181818] hover:bg-[#222] text-[#c5a059] border border-[#c5a059]/40 text-[11px] font-semibold py-2 px-3 rounded-lg transition-all flex items-center space-x-1"
                                    title="Registrar estos artículos en el Catálogo oficial del ERP"
                                  >
                                    <Package className="w-3.5 h-3.5" />
                                    <span>Guardar en Catálogo</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    handleEjecutarAccion(acc);
                                    onIrACotizacion();
                                  }}
                                  className="bg-[#1c1c1c] hover:bg-[#252525] text-stone-200 text-[11px] py-2 px-3 rounded-lg border border-[#2a2a2a] transition-all flex items-center space-x-1"
                                >
                                  <span>Cotizar</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className={`text-[10px] text-stone-500 block px-1 font-mono ${
                      esIA ? 'text-left' : 'text-right'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {cargando && (
              <div className="flex items-start space-x-2.5 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-black border border-[#c5a059]/40 p-0.5 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#c5a059] animate-spin" />
                </div>
                <div className="bg-[#111111] p-3.5 rounded-2xl text-xs text-stone-400 border border-[#1a1a1a] shadow-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-stone-400 ml-1">Mini Rey IA está analizando los planos y requerimientos técnicos...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas Especializadas */}
          <div className="px-3 pt-2 pb-1.5 bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <Lightbulb className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            {[
              '📹 Dimensionar 8 Cámaras 4K CCTV con NVR',
              '📐 Cableado para casa de 2 niveles (200m²)',
              '🏢 Red de datos y telefonía IP oficina',
              '🏗️ Guía de canalización en losa con tubería EMT'
            ].map((sug, idx) => (
              <button
                key={idx}
                onClick={() => enviarMensaje(sug)}
                className="text-[11px] text-stone-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#1f1f1f] hover:border-[#c5a059]/40 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Formulario de Entrada */}
          <div className="p-3 bg-[#111111] border-t border-[#1a1a1a]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensaje();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                id="input-chat-ia"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                placeholder="Pregunta a Mini Rey IA sobre redes, CCTV, planos arquitectónicos o presupuestos..."
                disabled={cargando}
                className="flex-1 bg-[#181818] text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#2a2a2a] focus:border-[#c5a059] outline-none transition-colors placeholder:text-stone-500"
              />

              <button
                type="submit"
                id="btn-enviar-chat-ia"
                disabled={!inputTexto.trim() || cargando}
                className="bg-[#c5a059] hover:bg-[#d4b068] disabled:bg-[#2a2a2a] text-black disabled:text-stone-500 font-semibold p-3 rounded-xl shadow-md transition-all disabled:cursor-not-allowed hover:scale-105 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
};
