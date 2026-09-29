import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FolderArchive, 
  FileCode, 
  Terminal, 
  Smartphone, 
  ExternalLink,
  Code2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ARCHIVOS_PROYECTO } from '../data/projectFiles';
import { ArchivoProyecto } from '../types';

interface ModalArchivosAPKProps {
  abierto: boolean;
  onCerrar: () => void;
}

export const ModalArchivosAPK: React.FC<ModalArchivosAPKProps> = ({ abierto, onCerrar }) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoProyecto>(ARCHIVOS_PROYECTO[0]);
  const [copiado, setCopiado] = useState(false);
  const [pestana, setPestana] = useState<'archivos' | 'guia_rapida'>('guia_rapida');

  if (!abierto) return null;

  const handleCopiarContenido = () => {
    navigator.clipboard.writeText(archivoSeleccionado.contenido);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDescargarArchivo = (archivo: ArchivoProyecto) => {
    const blob = new Blob([archivo.contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = archivo.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const comandoUnaLinea = 'npm install && npx eas-cli login && npx eas-cli build --platform android --profile preview';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in no-print">
      <div className="bg-[#0d0d0d] text-[#e0e0e0] rounded-2xl w-full max-w-5xl h-[90vh] max-h-[800px] flex flex-col shadow-2xl border border-[#1a1a1a] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#111111]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif italic font-bold text-base sm:text-lg text-white">
                  INNMEX SOLUCIONES • Paquete Android APK & Código
                </h2>
                <span className="bg-[#1a1a1a] text-[#c5a059] text-xs px-2.5 py-0.5 rounded-full font-mono border border-[#c5a059]/40">
                  Listo para EAS Build
                </span>
              </div>
              <p className="text-xs text-stone-400">Archivos, scripts automáticos (.bat/.sh) y configuración nativa de Expo</p>
            </div>
          </div>

          <button
            onClick={onCerrar}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          <button
            onClick={() => setPestana('guia_rapida')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pestana === 'guia_rapida'
                ? 'bg-[#c5a059] text-black font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Guía de Compilación en 1 Línea</span>
          </button>

          <button
            onClick={() => setPestana('archivos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pestana === 'archivos'
                ? 'bg-[#c5a059] text-black font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Explorador de Archivos ({ARCHIVOS_PROYECTO.length})</span>
          </button>
        </div>

        {/* Tab 1: Guía rápida */}
        {pestana === 'guia_rapida' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0d0d0d]">
            
            {/* Quick Command Banner */}
            <div className="bg-[#111111] border border-[#c5a059]/30 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#c5a059] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span>Compilación Instantánea en la Nube de Expo</span>
              </div>
              <h3 className="text-lg font-serif italic font-bold text-white mb-2">
                Generar APK sin instalar Android Studio ni Java
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                El proyecto ya incluye <code className="text-[#c5a059] font-mono">eas.json</code> configurado con el perfil <code className="text-[#c5a059] font-mono">preview</code> (buildType: "apk"). Ejecuta este comando en la terminal para obtener el enlace de descarga de tu APK:
              </p>

              <div className="bg-[#0a0a0a] p-3 rounded-xl border border-[#1a1a1a] flex items-center justify-between gap-3">
                <code className="text-xs font-mono text-[#c5a059] truncate flex-1 select-all">
                  {comandoUnaLinea}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(comandoUnaLinea);
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                  }}
                  className="bg-[#c5a059] hover:bg-[#d4b068] text-black text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 flex items-center space-x-1 transition-colors"
                >
                  {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Copiado' : 'Copiar comando'}</span>
                </button>
              </div>
            </div>

            {/* 3 Simple Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#c5a059]/40 text-[#c5a059] font-mono font-bold flex items-center justify-center text-xs mb-2">
                  1
                </div>
                <h4 className="font-serif italic font-bold text-sm text-white mb-1">Descarga el Proyecto</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Descarga los archivos del proyecto o el repositorio local y abre una terminal dentro de la carpeta.
                </p>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#c5a059]/40 text-[#c5a059] font-mono font-bold flex items-center justify-center text-xs mb-2">
                  2
                </div>
                <h4 className="font-serif italic font-bold text-sm text-white mb-1">Inicia Sesión en Expo</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Crea una cuenta gratuita en <a href="https://expo.dev/signup" target="_blank" rel="noreferrer" className="text-[#c5a059] underline">expo.dev</a>. No necesitas cuenta de Google Play Developer para generar el .APK.
                </p>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a]">
                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#c5a059]/40 text-[#c5a059] font-mono font-bold flex items-center justify-center text-xs mb-2">
                  3
                </div>
                <h4 className="font-serif italic font-bold text-sm text-white mb-1">Instala el APK en Android</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  EAS Build te entregará un código QR y enlace directo. Ábrelo en tu celular Android e instala directamente el archivo APK.
                </p>
              </div>
            </div>

            {/* Windows / Mac OS Scripts helper */}
            <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a]">
              <h4 className="font-serif italic font-bold text-sm text-white mb-2">Scripts incluidos en el paquete:</h4>
              <div className="space-y-2 text-xs text-stone-300">
                <p>• <strong>Windows:</strong> Haz doble clic en <code className="text-[#c5a059] font-mono">build_apk.bat</code> para ejecutar el asistente paso a paso.</p>
                <p>• <strong>Mac / Linux:</strong> Ejecuta <code className="text-[#c5a059] font-mono">chmod +x build_apk.sh && ./build_apk.sh</code> en la terminal.</p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Explorador de Archivos */}
        {pestana === 'archivos' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0d0d0d]">
            
            {/* Sidebar with files */}
            <div className="w-full md:w-72 bg-[#0a0a0a] border-r border-[#1a1a1a] overflow-y-auto p-3 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 px-2 block mb-2">
                Archivos del Proyecto
              </span>
              {ARCHIVOS_PROYECTO.map((archivo) => {
                const isSelected = archivoSeleccionado.nombre === archivo.nombre;

                return (
                  <button
                    key={archivo.nombre}
                    onClick={() => setArchivoSeleccionado(archivo)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#c5a059] text-black font-semibold'
                        : 'text-stone-300 hover:bg-[#141414]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-black' : 'text-[#c5a059]'}`} />
                      <span className="truncate">{archivo.nombre}</span>
                    </div>
                    <span className="text-[10px] opacity-60 ml-2 font-mono shrink-0">{archivo.tamano}</span>
                  </button>
                );
              })}
            </div>

            {/* Code preview & Action bar */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d0d]">
              
              {/* File details bar */}
              <div className="p-3 bg-[#111111] border-b border-[#1a1a1a] flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-mono font-bold text-xs text-white block">{archivoSeleccionado.ruta}</span>
                  <span className="text-[11px] text-stone-400">{archivoSeleccionado.descripcion}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopiarContenido}
                    className="flex items-center space-x-1 bg-[#1a1a1a] hover:bg-[#222] text-stone-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[#2a2a2a] transition-colors"
                  >
                    {copiado ? <Check className="w-3.5 h-3.5 text-[#c5a059]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiado ? 'Copiado' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={() => handleDescargarArchivo(archivoSeleccionado)}
                    className="flex items-center space-x-1 bg-[#c5a059] hover:bg-[#d4b068] text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>

              {/* Code viewer */}
              <div className="flex-1 overflow-auto p-4 bg-[#080808] font-mono text-xs text-stone-300 leading-relaxed select-all">
                <pre>{archivoSeleccionado.contenido}</pre>
              </div>

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-between text-xs text-stone-400">
          <span>INNMEX SOLUCIONES ERP Suite • Total: 19 archivos listos para producción</span>
          <button
            onClick={onCerrar}
            className="bg-[#1a1a1a] hover:bg-[#222] text-stone-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2a2a2a] transition-colors"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};
