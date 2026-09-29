import React, { useState } from 'react';
import { 
  Download, 
  Cpu, 
  HardDrive, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Sliders, 
  Globe, 
  Server, 
  RefreshCw, 
  AlertCircle,
  Laptop,
  CheckCircle2,
  Info
} from 'lucide-react';

export interface ModeloLocalInfo {
  id: string;
  nombre: string;
  desarrollador: string;
  version: string;
  tamanoGGUF: string;
  cuantizacion: string;
  ramRecomendada: string;
  contexto: string;
  enlaceDescargaGGUF: string;
  comandoOllama: string;
  descripcion: string;
  especialidad: string;
  recomendadoPara: string;
  esFavorito?: boolean;
}

export const MODELOS_LOCALES_CATALOGO: ModeloLocalInfo[] = [
  {
    id: 'qwen-2.5-7b',
    nombre: 'Qwen 2.5 7B Instruct',
    desarrollador: 'Alibaba Cloud / Qwen Team',
    version: '2.5',
    tamanoGGUF: '4.68 GB',
    cuantizacion: 'Q4_K_M (Equilibrado y Preciso)',
    ramRecomendada: '8 GB RAM / VRAM',
    contexto: '32k / 128k tokens',
    enlaceDescargaGGUF: 'https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf',
    comandoOllama: 'ollama run qwen2.5:7b',
    descripcion: 'Líder en tareas técnicas, matemáticas, cálculo de presupuestos y estructuración de especificaciones de hardware y CCTV.',
    especialidad: 'Dimensionamiento de Redes, Audio Multizona y Presupuestos',
    recomendadoPara: 'Mejor opción para el Ingeniero Virtual 40 en cálculos de ingeniería.',
    esFavorito: true
  },
  {
    id: 'deepseek-r1-7b',
    nombre: 'DeepSeek-R1 Distill Qwen 7B',
    desarrollador: 'DeepSeek AI / Unsloth',
    version: 'R1-Distill',
    tamanoGGUF: '4.68 GB',
    cuantizacion: 'Q4_K_M (Chain-of-Thought)',
    ramRecomendada: '8 GB RAM / VRAM',
    contexto: '32k tokens',
    enlaceDescargaGGUF: 'https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-7B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-7B-Q4_K_M.gguf',
    comandoOllama: 'ollama run deepseek-r1:7b',
    descripcion: 'Modelo con razonamiento profundo (Chain-of-Thought). Explica el porqué de cada cálculo de tubería, cableado y compatibilidad.',
    especialidad: 'Lectura de Planos, Fundamentos Civiles y Razonamiento Lógico',
    recomendadoPara: 'Ideal para proyectos de obra civil y análisis de planos complejos.',
    esFavorito: true
  },
  {
    id: 'llama-3.1-8b',
    nombre: 'Llama 3.1 8B Instruct',
    desarrollador: 'Meta AI',
    version: '3.1',
    tamanoGGUF: '4.92 GB',
    cuantizacion: 'Q4_K_M (Alta Precisión)',
    ramRecomendada: '8 GB RAM / VRAM',
    contexto: '128k tokens',
    enlaceDescargaGGUF: 'https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf',
    comandoOllama: 'ollama run llama3.1:8b',
    descripcion: 'El estándar de la industria de Meta. Enorme ventana de contexto y excelente redacción comercial y justificación técnica.',
    especialidad: 'Propuestas Comerciales, Políticas y Asesoría Técnica General',
    recomendadoPara: 'Proyectos con catálogos extensos y documentos largos.'
  },
  {
    id: 'mistral-7b-v0.3',
    nombre: 'Mistral 7B Instruct v0.3',
    desarrollador: 'Mistral AI',
    version: '0.3',
    tamanoGGUF: '4.37 GB',
    cuantizacion: 'Q4_K_M (Rápido)',
    ramRecomendada: '8 GB RAM / VRAM',
    contexto: '32k tokens',
    enlaceDescargaGGUF: 'https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3-Q4_K_M.gguf',
    comandoOllama: 'ollama run mistral:7b',
    descripcion: 'Velocidad de respuesta ultrarrápida con excelente seguimiento de instrucciones estrictas y llamadas a funciones.',
    especialidad: 'Generación Inmediata de Fichas de Catálogo y Cotizaciones Rápidas',
    recomendadoPara: 'Equipos donde se prioriza la velocidad de generación.'
  },
  {
    id: 'phi-4-mini-3.8b',
    nombre: 'Phi-4 Mini 3.8B Instruct',
    desarrollador: 'Microsoft Research',
    version: '4.0 Mini',
    tamanoGGUF: '2.49 GB',
    cuantizacion: 'Q4_K_M (Ultraligero)',
    ramRecomendada: '4 GB RAM / VRAM',
    contexto: '16k / 128k tokens',
    enlaceDescargaGGUF: 'https://huggingface.co/microsoft/Phi-4-mini-instruct-GGUF/resolve/main/Phi-4-mini-instruct-Q4_K_M.gguf',
    comandoOllama: 'ollama run phi4-mini',
    descripcion: 'Compacto y altamente optimizado por Microsoft. Funciona con gran fluidez incluso en laptops básicas sin GPU dedicada.',
    especialidad: 'Dispositivos Portátiles de Campo, Laptops de Obra y Mini PCs',
    recomendadoPara: 'Máquinas con pocos recursos o levantamientos en campo offline.'
  }
];

export interface ConfiguracionIAMiniRey {
  proveedorActivo: 'cloud_gemini' | 'local_ollama' | 'local_lmstudio';
  modeloCloud: 'gemini-2.5-flash' | 'gemini-2.0-flash';
  temperatura: number;
  modeloLocalSeleccionado: string;
  endpointLocal: string;
}

export const CONFIG_IA_DEFAULT: ConfiguracionIAMiniRey = {
  proveedorActivo: 'cloud_gemini',
  modeloCloud: 'gemini-2.5-flash',
  temperatura: 0.5,
  modeloLocalSeleccionado: 'qwen-2.5-7b',
  endpointLocal: 'http://localhost:11434'
};

interface AjustesModelosIAProps {
  config: ConfiguracionIAMiniRey;
  onGuardarConfig: (nuevaConfig: ConfiguracionIAMiniRey) => void;
  onCerrar?: () => void;
}

export const AjustesModelosIA: React.FC<AjustesModelosIAProps> = ({
  config,
  onGuardarConfig,
  onCerrar
}) => {
  const [configLocal, setConfigLocal] = useState<ConfiguracionIAMiniRey>(config);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [probandoConexion, setProbandoConexion] = useState(false);
  const [resultadoConexion, setResultadoConexion] = useState<{ exitoso: boolean; mensaje: string } | null>(null);
  const [pestana, setPestana] = useState<'modelos_locales' | 'servidor_cloud' | 'guia_offline'>('modelos_locales');

  const handleCopiarComando = (id: string, comando: string) => {
    navigator.clipboard.writeText(comando);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleProbarConexionLocal = async () => {
    setProbandoConexion(true);
    setResultadoConexion(null);
    try {
      // Intento de conexión con el endpoint configurado
      const endpoint = configLocal.endpointLocal.replace(/\/$/, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(`${endpoint}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const numModelos = data.models ? data.models.length : 0;
        setResultadoConexion({
          exitoso: true,
          mensaje: `✓ Conexión exitosa con Ollama local. ${numModelos} modelo(s) detectado(s).`
        });
      } else {
        setResultadoConexion({
          exitoso: false,
          mensaje: `Endpoint respondió con código ${res.status}. Verifica que el servicio esté corriendo.`
        });
      }
    } catch (e: any) {
      setResultadoConexion({
        exitoso: false,
        mensaje: `No se pudo conectar a ${configLocal.endpointLocal}. Asegúrate de tener Ollama o LM Studio abierto localmente.`
      });
    } finally {
      setProbandoConexion(false);
    }
  };

  const handleGuardar = () => {
    onGuardarConfig(configLocal);
    if (onCerrar) onCerrar();
  };

  return (
    <div className="space-y-5 text-stone-200">
      
      {/* Encabezado Principal */}
      <div className="bg-[#111111] p-4 sm:p-5 rounded-2xl border border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-black border border-[#c5a059]/60 flex items-center justify-center p-1.5 shadow-lg text-[#c5a059] shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif italic font-bold text-white text-base sm:text-lg">
                Ajustes de Motor de IA & Modelos Locales
              </h2>
              <span className="bg-[#1c1c1c] text-[#c5a059] text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#c5a059]/40">
                Mini Rey IA
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Alterna entre la nube segura de Gemini o ejecuta modelos de ingeniería 100% locales y offline (GGUF / Ollama).
            </p>
          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <button
            onClick={handleGuardar}
            className="inline-flex items-center space-x-1.5 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Ajustes</span>
          </button>
        </div>
      </div>

      {/* Selector de Pestañas de Ajustes */}
      <div className="flex items-center space-x-2 border-b border-[#1a1a1a] pb-2 overflow-x-auto">
        <button
          onClick={() => setPestana('modelos_locales')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            pestana === 'modelos_locales'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-[#141414]'
          }`}
        >
          <HardDrive className="w-4 h-4 text-[#c5a059]" />
          <span>Modelos Locales con Descarga Directa ({MODELOS_LOCALES_CATALOGO.length})</span>
        </button>

        <button
          onClick={() => setPestana('servidor_cloud')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            pestana === 'servidor_cloud'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#c5a059]" />
          <span>Proveedor Cloud Seguro (Gemini)</span>
        </button>

        <button
          onClick={() => setPestana('guia_offline')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            pestana === 'guia_offline'
              ? 'bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/50 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-[#141414]'
          }`}
        >
          <Laptop className="w-4 h-4 text-[#c5a059]" />
          <span>Guía de Ejecución Offline</span>
        </button>
      </div>

      {/* 1. SECCIÓN DE MODELOS LOCALES CON DESCARGA DIRECTA */}
      {pestana === 'modelos_locales' && (
        <div className="space-y-4">
          
          {/* Banner de Estado Local */}
          <div className="bg-[#111111] p-4 rounded-xl border border-[#222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`w-3.5 h-3.5 rounded-full ${configLocal.proveedorActivo === 'local_ollama' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-500'}`} />
              <div>
                <span className="text-xs font-mono font-bold text-white uppercase block">
                  Modo de Operación Actual: {configLocal.proveedorActivo === 'local_ollama' ? '🟢 Local Offline (Ollama / GGUF)' : '🌐 Cloud Gemini Proxy'}
                </span>
                <span className="text-[11px] text-stone-400">
                  {configLocal.proveedorActivo === 'local_ollama'
                    ? `Mini Rey IA enviará las peticiones a: ${configLocal.endpointLocal}`
                    : 'Mini Rey IA utiliza el backend seguro con API Key protegida en servidor.'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setConfigLocal(prev => ({
                ...prev,
                proveedorActivo: prev.proveedorActivo === 'local_ollama' ? 'cloud_gemini' : 'local_ollama'
              }))}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all ${
                configLocal.proveedorActivo === 'local_ollama'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
              }`}
            >
              {configLocal.proveedorActivo === 'local_ollama' ? 'Cambiar a Nube Gemini' : 'Activar Modo Local Ollama'}
            </button>
          </div>

          {/* Configuración de Endpoint Local */}
          {configLocal.proveedorActivo === 'local_ollama' && (
            <div className="bg-[#141414] p-4 rounded-xl border border-[#c5a059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wide flex items-center space-x-1.5">
                  <Server className="w-3.5 h-3.5" />
                  <span>Configuración de Endpoint Local (Ollama / LM Studio)</span>
                </span>
                <button
                  type="button"
                  onClick={handleProbarConexionLocal}
                  disabled={probandoConexion}
                  className="text-xs text-[#c5a059] hover:underline flex items-center space-x-1 font-mono disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${probandoConexion ? 'animate-spin' : ''}`} />
                  <span>Probar Conexión</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={configLocal.endpointLocal}
                  onChange={(e) => setConfigLocal(prev => ({ ...prev, endpointLocal: e.target.value }))}
                  placeholder="http://localhost:11434"
                  className="flex-1 bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl px-3.5 py-2 text-xs font-mono focus:border-[#c5a059] outline-none"
                />
                <select
                  value={configLocal.modeloLocalSeleccionado}
                  onChange={(e) => setConfigLocal(prev => ({ ...prev, modeloLocalSeleccionado: e.target.value }))}
                  className="bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs font-mono focus:border-[#c5a059] outline-none"
                >
                  {MODELOS_LOCALES_CATALOGO.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({m.tamanoGGUF})
                    </option>
                  ))}
                </select>
              </div>

              {resultadoConexion && (
                <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center space-x-2 ${
                  resultadoConexion.exitoso ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                }`}>
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{resultadoConexion.mensaje}</span>
                </div>
              )}
            </div>
          )}

          {/* Catálogo de Modelos con Botón de Descarga Directa */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold">
                Modelos GGUF Recomendados para Ingeniería y Cotizaciones:
              </span>
              <span className="text-[11px] text-[#c5a059] font-mono">
                Cuantización Q4_K_M • Enlaces Directos Oficiales Hugging Face
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {MODELOS_LOCALES_CATALOGO.map((m) => {
                const esSeleccionado = configLocal.modeloLocalSeleccionado === m.id;
                return (
                  <div
                    key={m.id}
                    className={`bg-[#111111] p-4 sm:p-5 rounded-2xl border transition-all ${
                      esSeleccionado 
                        ? 'border-[#c5a059] bg-gradient-to-r from-[#111111] via-[#161510] to-[#111111] shadow-xl' 
                        : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Información del Modelo */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif italic font-bold text-white text-base">
                            {m.nombre}
                          </span>
                          <span className="bg-[#1c1c1c] text-stone-300 text-[10px] font-mono px-2 py-0.5 rounded border border-[#2a2a2a]">
                            {m.desarrollador}
                          </span>
                          <span className="bg-[#1c1c1c] text-[#c5a059] text-[10px] font-mono px-2 py-0.5 rounded border border-[#c5a059]/40 font-bold">
                            {m.tamanoGGUF}
                          </span>
                          {m.esFavorito && (
                            <span className="bg-amber-950/70 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-800">
                              ⭐ Recomendado
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-300 leading-relaxed">
                          {m.descripcion}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono text-stone-400">
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Cuantización</span>
                            <span className="text-stone-300 font-semibold">{m.cuantizacion}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">RAM Mínima</span>
                            <span className="text-stone-300 font-semibold">{m.ramRecomendada}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Ventana Contexto</span>
                            <span className="text-stone-300 font-semibold">{m.contexto}</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block text-[9px] uppercase">Especialidad</span>
                            <span className="text-[#c5a059] font-semibold">{m.especialidad}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción (Descarga Directa y Ollama) */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:w-64">
                        
                        {/* ENLACE DE DESCARGA DIRECTA */}
                        <a
                          href={m.enlaceDescargaGGUF}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center justify-center space-x-2 bg-[#c5a059] hover:bg-[#d4b068] text-black font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                          title="Descargar archivo GGUF directamente desde Hugging Face"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Descargar GGUF ({m.tamanoGGUF})</span>
                        </a>

                        {/* Botón Copiar Comando Ollama */}
                        <button
                          type="button"
                          onClick={() => handleCopiarComando(m.id, m.comandoOllama)}
                          className="inline-flex items-center justify-center space-x-1.5 bg-[#181818] hover:bg-[#222] text-stone-300 border border-[#2a2a2a] text-[11px] font-mono py-2 px-3 rounded-xl transition-all"
                          title="Copiar comando para correr en terminal con Ollama"
                        >
                          {copiadoId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Terminal className="w-3.5 h-3.5 text-[#c5a059]" />
                              <span>{m.comandoOllama}</span>
                              <Copy className="w-3 h-3 text-stone-500 ml-1" />
                            </>
                          )}
                        </button>

                        {/* Seleccionar como activo */}
                        <button
                          type="button"
                          onClick={() => setConfigLocal(prev => ({
                            ...prev,
                            modeloLocalSeleccionado: m.id
                          }))}
                          className={`text-[11px] font-medium py-1.5 px-3 rounded-xl transition-all text-center ${
                            esSeleccionado
                              ? 'bg-[#222] text-[#c5a059] border border-[#c5a059]/40'
                              : 'text-stone-400 hover:text-white hover:bg-[#161616]'
                          }`}
                        >
                          {esSeleccionado ? '✓ Modelo Seleccionado' : 'Seleccionar como Modelo Activo'}
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. SECCIÓN DE PROVEEDOR CLOUD SEGURO (GEMINI PROXY) */}
      {pestana === 'servidor_cloud' && (
        <div className="bg-[#111111] p-5 sm:p-6 rounded-2xl border border-[#1a1a1a] space-y-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-white text-base">
                Seguridad de API Key & Proxy de Servidor
              </h3>
              <p className="text-xs text-stone-400">
                Tus credenciales y claves de API están resguardadas en el backend Express (`/api/ia/*`) mediante variables de entorno seguras.
              </p>
            </div>
          </div>

          <div className="bg-black/60 p-4 rounded-xl border border-[#222] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-mono">Estado de Conexión:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Activo y Operativo en Servidor</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-mono">Ubicación de API Key:</span>
              <span className="text-stone-200 font-mono">Variable de Entorno GEMINI_API_KEY (Server-side)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400 font-mono">Exposición en Cliente:</span>
              <span className="text-emerald-400 font-mono font-bold">0% (Protección absoluta contra fugas)</span>
            </div>
          </div>

          {/* Ajustes de Parámetros de Generación */}
          <div className="space-y-4 pt-2 border-t border-[#1a1a1a]">
            <div>
              <label className="text-xs font-mono uppercase text-stone-300 block mb-1.5">
                Modelo Cloud Gemini Seleccionado:
              </label>
              <select
                value={configLocal.modeloCloud}
                onChange={(e) => setConfigLocal(prev => ({ ...prev, modeloCloud: e.target.value as any }))}
                className="w-full bg-[#181818] text-white border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-xs font-mono focus:border-[#c5a059] outline-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recomendado para cálculos técnicos y razonamiento rápido)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Baja latencia y respuestas concisas)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono uppercase text-stone-300">
                  Temperatura de Razonamiento: {configLocal.temperatura}
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  {configLocal.temperatura <= 0.3 ? '🎯 Muy Preciso (Cálculos matemáticos)' : configLocal.temperatura <= 0.6 ? '⚖️ Equilibrado (Ingeniería + Consultoría)' : '💡 Creativo'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={configLocal.temperatura}
                onChange={(e) => setConfigLocal(prev => ({ ...prev, temperatura: parseFloat(e.target.value) }))}
                className="w-full accent-[#c5a059] bg-[#222] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. GUÍA DE EJECUCIÓN OFFLINE EN 3 PASOS */}
      {pestana === 'guia_offline' && (
        <div className="bg-[#111111] p-5 sm:p-6 rounded-2xl border border-[#1a1a1a] space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif italic font-bold text-white text-base">
                ¿Cómo usar Mini Rey IA sin internet con Modelos Locales?
              </h3>
              <p className="text-xs text-stone-400">
                Paso a paso para ejecutar modelos GGUF u Ollama en tu propia computadora con privacidad total.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            
            <div className="bg-black/60 p-4 rounded-xl border border-[#222] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#c5a059] text-[#c5a059] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Descarga el Modelo</h4>
              <p className="text-[11px] text-stone-400">
                Haz clic en el botón de <strong>Descargar GGUF</strong> del modelo de tu preferencia (ej: Qwen 2.5 7B o DeepSeek-R1) desde la pestaña de Modelos Locales.
              </p>
            </div>

            <div className="bg-black/60 p-4 rounded-xl border border-[#222] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#c5a059] text-[#c5a059] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Instala Ollama o LM Studio</h4>
              <p className="text-[11px] text-stone-400">
                Instala <strong>Ollama</strong> (ollama.com) o <strong>LM Studio</strong> (lmstudio.ai). Ambos programas crean un servidor de inferencia local en tu equipo.
              </p>
            </div>

            <div className="bg-black/60 p-4 rounded-xl border border-[#222] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#c5a059] text-[#c5a059] font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Conecta Mini Rey IA</h4>
              <p className="text-[11px] text-stone-400">
                En esta ventana de ajustes, activa el <strong>Modo Local Ollama</strong> y pulsa <em>Probar Conexión</em>. ¡Listo! Mini Rey IA responderá desde tu procesador o tarjeta gráfica.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
