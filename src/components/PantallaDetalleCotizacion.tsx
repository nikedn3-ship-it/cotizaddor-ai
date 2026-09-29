import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  FileCheck,
  Download,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Cotizacion, EstadoCotizacion, Articulo } from '../types';
import { formatearMoneda, formatearFecha, ARTICULOS_INICIALES } from '../data/mockData';

interface PantallaDetalleCotizacionProps {
  cotizacion: Cotizacion;
  articulos?: Articulo[];
  onVolver: () => void;
  onCambiarEstado: (id: string, nuevoEstado: EstadoCotizacion) => void;
}

export const PantallaDetalleCotizacion: React.FC<PantallaDetalleCotizacionProps> = ({
  cotizacion,
  articulos,
  onVolver,
  onCambiarEstado
}) => {
  const [copiado, setCopiado] = useState(false);
  const [descargandoPDF, setDescargandoPDF] = useState(false);
  const cotizacionRef = useRef<HTMLDivElement>(null);

  // Helper para localizar artículo en catálogo y su imagen / descripción
  const obtenerArticuloCatalogo = (item: any): Articulo | undefined => {
    const catalogo = articulos && articulos.length > 0 ? articulos : ARTICULOS_INICIALES;
    return catalogo.find(
      a => a.id === item.articuloId || 
           a.sku === item.sku || 
           a.nombre?.toLowerCase().trim() === item.nombre?.toLowerCase().trim()
    );
  };

  const obtenerImagenArticulo = (item: any): string => {
    if (item.imagenUrl) return item.imagenUrl;
    const art = obtenerArticuloCatalogo(item);
    if (art?.imagenUrl) return art.imagenUrl;

    const skuUpper = (item.sku || '').toUpperCase();
    const nombreUpper = (item.nombre || '').toUpperCase();

    if (skuUpper.includes('FORTI') || nombreUpper.includes('FORTINET') || skuUpper.includes('FW')) {
      return 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('UNIFI') || nombreUpper.includes('UBIQUITI') || skuUpper.includes('U6') || skuUpper.includes('AP')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('CCTV') || skuUpper.includes('CAM') || nombreUpper.includes('CÁMARA') || nombreUpper.includes('CAMARA')) {
      return 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('NVR') || nombreUpper.includes('NVR') || nombreUpper.includes('GRABADOR')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('PURPLE') || skuUpper.includes('HDD') || nombreUpper.includes('DISCO')) {
      return 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('THINK') || skuUpper.includes('LAP') || nombreUpper.includes('LAPTOP')) {
      return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('DL380') || skuUpper.includes('SRV') || nombreUpper.includes('SERVIDOR')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('C9200') || skuUpper.includes('CISCO') || skuUpper.includes('SW')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('COND') || skuUpper.includes('EMT') || nombreUpper.includes('CONDUIT') || nombreUpper.includes('TUBERÍA')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('VOIP') || skuUpper.includes('YEALINK') || nombreUpper.includes('TELÉFONO')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('CAB') || skuUpper.includes('UTP') || nombreUpper.includes('CABLE')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('RACK') || nombreUpper.includes('GABINETE')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('UPS') || skuUpper.includes('APC')) {
      return 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('M365') || skuUpper.includes('LIC')) {
      return 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('DELL') || skuUpper.includes('MON')) {
      return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80';
    }
    if (skuUpper.includes('NAS') || skuUpper.includes('SYN')) {
      return 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
  };

  const handleImprimir = () => {
    window.print();
  };

  const generarPDFVectorDirecto = (cot: Cotizacion) => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Fondo corporativo
    pdf.setFillColor(13, 13, 13);
    pdf.rect(0, 0, pageWidth, pdf.internal.pageSize.getHeight(), 'F');

    // Cabecera institucional
    pdf.setTextColor(197, 160, 89);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INNMEX SOLUCIONES', 15, 20);

    pdf.setFontSize(7.5);
    pdf.setTextColor(200, 200, 200);
    pdf.text('SISTEMA MINI REY IA - ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS', 15, 25);
    pdf.text('INNMEX SOLUCIONES S.A. DE C.V. • RFC: INN20180415-K91 • Tel: +52 (55) 8000-INNMEX', 15, 29);
    pdf.text('Av. Paseo de la Reforma 222, Piso 14, Ciudad de México • ventas@innmex.com', 15, 33);

    // Línea dorada divisoria
    pdf.setDrawColor(197, 160, 89);
    pdf.setLineWidth(0.4);
    pdf.line(15, 36, pageWidth - 15, 36);

    // Folio y datos de cotización
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.text(`PRESUPUESTO OFICIAL: ${cot.numero}`, 15, 43);

    pdf.setFontSize(8.5);
    pdf.setTextColor(180, 180, 180);
    pdf.text(`Fecha de Emisión: ${formatearFecha(cot.fecha)}`, 15, 48);
    pdf.text(`Vigencia Comercial: ${cot.validezDias} días naturales`, 15, 53);
    pdf.text(`Estado del Documento: ${cot.estado.toUpperCase()}`, 15, 58);

    // Cuadro de cliente
    pdf.setFillColor(20, 20, 20);
    pdf.setDrawColor(50, 50, 50);
    pdf.roundedRect(pageWidth - 95, 39, 80, 23, 2, 2, 'FD');
    pdf.setTextColor(197, 160, 89);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CLIENTE / PROSPECTO:', pageWidth - 90, 44);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.text(cot.clienteNombre, pageWidth - 90, 49);
    pdf.setTextColor(170, 170, 170);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    if (cot.empresa) pdf.text(cot.empresa, pageWidth - 90, 54);
    if (cot.email) pdf.text(cot.email, pageWidth - 90, 58);

    // Encabezado de tabla
    let currentY = 68;
    pdf.setFillColor(28, 28, 28);
    pdf.rect(15, currentY, pageWidth - 30, 8, 'F');
    pdf.setTextColor(197, 160, 89);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SKU', 18, currentY + 5.5);
    pdf.text('DESCRIPCIÓN DE PARTIDA', 50, currentY + 5.5);
    pdf.text('CANT', 125, currentY + 5.5);
    pdf.text('P. UNITARIO', 145, currentY + 5.5);
    pdf.text('SUBTOTAL', pageWidth - 20, currentY + 5.5, { align: 'right' });

    currentY += 8;

    // Filas de artículos
    pdf.setFont('helvetica', 'normal');
    cot.items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        pdf.setFillColor(18, 18, 18);
        pdf.rect(15, currentY, pageWidth - 30, 8, 'F');
      }
      pdf.setTextColor(197, 160, 89);
      pdf.setFontSize(8);
      pdf.text(item.sku, 18, currentY + 5.5);

      pdf.setTextColor(230, 230, 230);
      const nombreRecortado = item.nombre.length > 40 ? item.nombre.slice(0, 38) + '...' : item.nombre;
      pdf.text(nombreRecortado, 50, currentY + 5.5);

      pdf.text(String(item.cantidad), 128, currentY + 5.5);
      pdf.text(formatearMoneda(item.precioUnitario), 145, currentY + 5.5);

      pdf.setTextColor(197, 160, 89);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatearMoneda(item.subtotal), pageWidth - 20, currentY + 5.5, { align: 'right' });
      pdf.setFont('helvetica', 'normal');

      currentY += 8;
    });

    // Totales
    currentY += 5;
    const totX = pageWidth - 70;
    pdf.setTextColor(180, 180, 180);
    pdf.setFontSize(8);
    pdf.text('Subtotal Bruto:', totX, currentY);
    pdf.text(formatearMoneda(cot.subtotalBruto), pageWidth - 20, currentY, { align: 'right' });

    if (cot.montoDescuento > 0) {
      currentY += 5;
      pdf.text('Descuento Comercial:', totX, currentY);
      pdf.text(`-${formatearMoneda(cot.montoDescuento)}`, pageWidth - 20, currentY, { align: 'right' });
    }

    currentY += 5;
    pdf.text('IVA Trasladado (16%):', totX, currentY);
    pdf.text(formatearMoneda(cot.montoIva), pageWidth - 20, currentY, { align: 'right' });

    currentY += 6;
    pdf.setFillColor(197, 160, 89);
    pdf.rect(totX - 5, currentY - 4, pageWidth - totX - 10, 8, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('TOTAL:', totX, currentY + 1.5);
    pdf.text(formatearMoneda(cot.total), pageWidth - 20, currentY + 1.5, { align: 'right' });

    // Firmas
    currentY += 28;
    pdf.setDrawColor(197, 160, 89);
    pdf.setLineWidth(0.3);
    pdf.line(25, currentY, 85, currentY);
    pdf.setDrawColor(80, 80, 80);
    pdf.line(pageWidth - 85, currentY, pageWidth - 25, currentY);

    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EJECUTIVO COMERCIAL AUTORIZADO', 55, currentY + 5, { align: 'center' });
    pdf.setTextColor(197, 160, 89);
    pdf.setFontSize(7);
    pdf.text('INNMEX SOLUCIONES • Mini Rey IA', 55, currentY + 9, { align: 'center' });

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text(cot.clienteNombre, pageWidth - 55, currentY + 5, { align: 'center' });
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Firma de Conformidad / Aceptación', pageWidth - 55, currentY + 9, { align: 'center' });

    // Pie de página oficial
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(7);
    pdf.text('Documento digital oficial y sello emitido por INNMEX SOLUCIONES • SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN', pageWidth / 2, 285, { align: 'center' });

    pdf.save(`${cot.numero}_INNMEX_SOLUCIONES.pdf`);
  };

  const handleDescargarPDF = async () => {
    if (!cotizacionRef.current || descargandoPDF) return;

    setDescargandoPDF(true);
    try {
      const elemento = cotizacionRef.current;

      // Usar toPng de html-to-image para evitar conflictos de color oklab de Tailwind
      const imgData = await toPng(elemento, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0d0d0d',
        cacheBust: true
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 10; // 5mm margen
      const elementWidth = elemento.offsetWidth || 800;
      const elementHeight = elemento.offsetHeight || 1100;
      const imgHeight = (elementHeight * imgWidth) / elementWidth;

      let posicionY = 5;
      let alturaRestante = imgHeight;

      pdf.addImage(imgData, 'PNG', 5, posicionY, imgWidth, imgHeight);
      alturaRestante -= (pdfHeight - 10);

      while (alturaRestante > 0) {
        posicionY -= (pdfHeight - 10);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 5, posicionY, imgWidth, imgHeight);
        alturaRestante -= (pdfHeight - 10);
      }

      const nombreArchivo = `${cotizacion.numero}_INNMEX_SOLUCIONES.pdf`;
      pdf.save(nombreArchivo);
    } catch (error) {
      console.warn('Fallback a generador de PDF vectorial directo por compatibilidad:', error);
      try {
        generarPDFVectorDirecto(cotizacion);
      } catch (vectorErr) {
        console.error('Error en generador vectorial, usando print:', vectorErr);
        window.print();
      }
    } finally {
      setDescargandoPDF(false);
    }
  };

  const handleCopiarEnlace = () => {
    const textoResumen = `INNMEX SOLUCIONES - Cotización ${cotizacion.numero}
SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS.
Cliente: ${cotizacion.clienteNombre} (${cotizacion.empresa || 'Particular'})
Total: ${formatearMoneda(cotizacion.total)}
Estado: ${cotizacion.estado.toUpperCase()}
Artículos: ${cotizacion.items.length} ítems`;

    navigator.clipboard.writeText(textoResumen);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCompartirWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola ${cotizacion.clienteNombre}, le compartimos la cotización ${cotizacion.numero} de INNMEX SOLUCIONES por un total de ${formatearMoneda(cotizacion.total)}. Válida por ${cotizacion.validezDias} días.`
    );
    window.open(`https://api.whatsapp.com/send?text=${mensaje}`, '_blank');
  };

  const esAprobada = cotizacion.estado === 'aprobada';
  const esRechazada = cotizacion.estado === 'rechazada';

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top action bar (hidden on print) */}
      <div className="no-print bg-[#0d0d0d] rounded-2xl p-4 border border-[#1a1a1a] flex flex-wrap items-center justify-between gap-3">
        
        <button
          id="btn-detalle-volver"
          onClick={onVolver}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-stone-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#1a1a1a] px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Historial</span>
        </button>

        {/* State badges & Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">Estado:</span>
          
          <select
            value={cotizacion.estado}
            onChange={(e) => onCambiarEstado(cotizacion.id, e.target.value as EstadoCotizacion)}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
              esAprobada 
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
                : esRechazada 
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800/60' 
                  : 'bg-[#141414] text-[#c5a059] border-[#c5a059]/40'
            }`}
          >
            <option value="pendiente">⏱ PENDIENTE</option>
            <option value="aprobada">✓ APROBADA</option>
            <option value="rechazada">✕ RECHAZADA</option>
          </select>
        </div>

        {/* Print, Download and Share Actions */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={handleCopiarEnlace}
            className="inline-flex items-center space-x-1 bg-[#141414] hover:bg-[#1a1a1a] text-stone-300 text-xs font-medium px-3 py-2 rounded-xl border border-[#1a1a1a] transition-colors"
            title="Copiar resumen comercial"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-[#c5a059]" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiado ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleCompartirWhatsApp}
            className="inline-flex items-center space-x-1 bg-emerald-950/40 hover:bg-emerald-950 text-emerald-300 text-xs font-medium px-3 py-2 rounded-xl transition-colors border border-emerald-800/50"
            title="Enviar por WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Botón Principal para Descargar PDF Directo */}
          <button
            id="btn-descargar-pdf"
            onClick={handleDescargarPDF}
            disabled={descargandoPDF}
            className="inline-flex items-center space-x-1.5 bg-[#c5a059] hover:bg-[#d4b068] text-black text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-75"
            title="Descargar archivo PDF oficial en el dispositivo"
          >
            {descargandoPDF ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Descargar PDF</span>
              </>
            )}
          </button>

          <button
            id="btn-imprimir-pdf"
            onClick={handleImprimir}
            className="inline-flex items-center space-x-1.5 bg-[#181818] hover:bg-[#222] text-stone-200 border border-[#2a2a2a] text-xs font-medium px-3 py-2 rounded-xl transition-all"
            title="Abrir diálogo de impresión del navegador"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

        </div>

      </div>

      {/* DOCUMENTO OFICIAL / PDF PREVIEW CONTAINER */}
      <div 
        ref={cotizacionRef}
        id="documento-pdf-cotizacion"
        className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-10 border border-[#1a1a1a] text-[#e0e0e0] max-w-4xl mx-auto shadow-2xl"
      >
        
        {/* Header: Company & Quote Folio */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-[#c5a059]/40 gap-4">
          
          {/* Company Brand with Logo */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <img 
                src="/innmex_logo.png" 
                alt="INNMEX SOLUCIONES Logo" 
                className="w-20 h-24 sm:w-24 sm:h-28 object-contain rounded-2xl border-2 border-[#c5a059]/60 bg-black p-1.5 shadow-2xl shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-white leading-tight font-bold tracking-wide">
                  INNMEX SOLUCIONES
                </h2>
                <p className="text-[10px] sm:text-xs font-semibold text-[#c5a059] tracking-tight mt-1 max-w-md">
                  SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS.
                </p>
                <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block mt-1.5">
                  INNMEX ERP Enterprise Cloud • Cotizador Oficial
                </span>
              </div>
            </div>

            <div className="text-xs text-stone-400 pt-1 space-y-0.5">
              <p className="font-medium text-stone-200">INNMEX SOLUCIONES S.A. DE C.V.</p>
              <p>RFC: INN20180415-K91 • Tel: +52 (55) 8000-INNMEX</p>
              <p>ventas@innmex.com • www.innmex.com</p>
              <p>Av. Paseo de la Reforma 222, Piso 14, Ciudad de México</p>
            </div>
          </div>

          {/* Quote Identifier Badge */}
          <div className="sm:text-right space-y-1 self-stretch sm:self-auto bg-[#111111] sm:bg-transparent p-3 sm:p-0 rounded-xl border border-[#1a1a1a] sm:border-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">Presupuesto Comercial INNMEX</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#c5a059] tracking-tight">
              {cotizacion.numero}
            </div>
            <div className="text-xs text-stone-400 space-y-0.5">
              <p><strong className="text-stone-300">Fecha:</strong> {formatearFecha(cotizacion.fecha)}</p>
              <p><strong className="text-stone-300">Vigencia:</strong> {cotizacion.validezDias} días naturales</p>
              <div className="inline-block mt-1">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                  esAprobada 
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
                    : esRechazada 
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/60' 
                      : 'bg-[#141414] text-[#c5a059] border-[#c5a059]/40'
                }`}>
                  ESTADO: {cotizacion.estado}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Client & Billing Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-[#1a1a1a] text-xs">
          
          <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a] space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider block">Dirigido a:</span>
            <p className="font-serif italic font-bold text-sm text-white">{cotizacion.clienteNombre}</p>
            {cotizacion.empresa && (
              <p className="text-stone-300 font-medium">{cotizacion.empresa}</p>
            )}
            {cotizacion.documentoIdentidad && (
              <p className="text-stone-400 font-mono">RFC / ID: {cotizacion.documentoIdentidad}</p>
            )}
          </div>

          <div className="bg-[#111111] p-4 rounded-xl border border-[#1a1a1a] space-y-1">
            <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider block">Datos de Contacto:</span>
            {cotizacion.email ? (
              <p className="text-stone-300"><strong>Email:</strong> {cotizacion.email}</p>
            ) : (
              <p className="text-stone-400 italic">No especificado</p>
            )}
            {cotizacion.telefono && (
              <p className="text-stone-300"><strong>Teléfono:</strong> {cotizacion.telefono}</p>
            )}
            <p className="text-stone-400 text-[11px] pt-1">
              Atención ejecutiva: INNMEX Corporate Sales Team • Mini Rey IA (Ingeniero Virtual 40)
            </p>
          </div>

        </div>

        {/* Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#c5a059]/40 text-[#c5a059] uppercase font-mono text-[11px] tracking-wider">
                <th className="py-2.5 pr-2">SKU</th>
                <th className="py-2.5 px-2">Descripción</th>
                <th className="py-2.5 px-2 text-center">Cant.</th>
                <th className="py-2.5 px-2 text-right">Precio Unit.</th>
                <th className="py-2.5 px-2 text-right">Desc.</th>
                <th className="py-2.5 pl-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {cotizacion.items.map((item, index) => {
                const imgUrl = obtenerImagenArticulo(item);
                const artInfo = obtenerArticuloCatalogo(item);

                return (
                  <tr key={index} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 pr-2 font-mono font-semibold text-[#c5a059] text-[11px] align-middle">
                      {item.sku}
                    </td>
                    <td className="py-3 px-2 font-medium text-stone-200 align-middle">
                      <div className="flex items-center space-x-3.5">
                        {/* Imagen del producto propuesto */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black border border-[#c5a059]/40 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-md group">
                          <img
                            src={imgUrl}
                            alt={item.nombre}
                            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {/* Nombre y detalles técnicos */}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-semibold text-white block">
                            {item.nombre}
                          </span>
                          {artInfo?.descripcion && (
                            <span className="text-[10px] text-stone-400 block line-clamp-1 mt-0.5 max-w-md">
                              {artInfo.descripcion}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-white align-middle">
                      {item.cantidad}
                    </td>
                    <td className="py-3 px-2 text-right text-stone-300 align-middle">
                      {formatearMoneda(item.precioUnitario)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium text-stone-400 align-middle">
                      {item.descuentoPorcentaje > 0 ? `${item.descuentoPorcentaje}%` : '-'}
                    </td>
                    <td className="py-3 pl-2 text-right font-serif font-bold text-[#c5a059] align-middle">
                      {formatearMoneda(item.subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Breakdown */}
        <div className="pt-4 pb-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between gap-6">
          
          {/* Notes & Observations */}
          <div className="flex-1 space-y-2">
            <span className="text-[10px] uppercase font-mono text-stone-400 tracking-wider block">
              Términos y Observaciones Comerciales:
            </span>
            <div className="bg-[#111111] p-3 rounded-xl border border-[#1a1a1a] text-xs text-stone-300 leading-relaxed min-h-[80px]">
              {cotizacion.observaciones ? (
                cotizacion.observaciones
              ) : (
                'Precios expresados en dólares americanos (USD). Sujeto a disponibilidad de inventario al momento de emitir la orden de compra confirmada. Garantía estándar de fabricante.'
              )}
            </div>
          </div>

          {/* Totals Table */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal Bruto:</span>
              <span className="font-semibold text-white">{formatearMoneda(cotizacion.subtotalBruto)}</span>
            </div>

            {cotizacion.montoDescuento > 0 && (
              <div className="flex justify-between text-rose-400 font-medium">
                <span>Descuento Aplicado:</span>
                <span>-{formatearMoneda(cotizacion.montoDescuento)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-400">
              <span>Subtotal Neto:</span>
              <span className="font-semibold text-white">{formatearMoneda(cotizacion.subtotalNeto)}</span>
            </div>

            <div className="flex justify-between text-stone-400">
              <span>IVA ({Math.round(cotizacion.tasaIva * 100)}%):</span>
              <span className="font-semibold text-white">{formatearMoneda(cotizacion.montoIva)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-[#1a1a1a] text-sm font-bold">
              <span className="text-white font-mono uppercase text-xs">TOTAL COTIZADO:</span>
              <span className="text-xl font-serif font-bold text-[#c5a059]">
                {formatearMoneda(cotizacion.total)}
              </span>
            </div>
          </div>

        </div>

        {/* SELLO DIGITAL OFICIAL INNMEX & CERTIFICACIÓN */}
        <div className="pt-6 pb-6 border-t border-[#1a1a1a]">
          <div className="bg-[#111111] p-4 rounded-xl border border-[#c5a059]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Sello circular INNMEX & Logo */}
            <div className="flex items-center space-x-3.5">
              <img 
                src="/innmex_logo.png" 
                alt="Sello INNMEX" 
                className="w-14 h-16 object-contain rounded-xl border border-[#c5a059] bg-black p-0.5 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#c5a059] flex flex-col items-center justify-center text-center p-1 bg-black/60 shadow-inner shrink-0 rotate-[-4deg]">
                <span className="text-[8px] font-mono font-bold text-[#c5a059] tracking-tighter uppercase leading-none">★ SELLO ★</span>
                <span className="text-[11px] font-serif font-black text-white tracking-widest my-0.5">INNMEX</span>
                <span className="text-[7px] font-mono text-[#c5a059] uppercase leading-none">OFICIAL ERP</span>
              </div>
              
              <div className="text-left space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-serif italic font-bold text-xs text-white">
                    SELLO DIGITAL Y TIMBRE OFICIAL INNMEX
                  </span>
                  <span className="bg-emerald-950/80 text-emerald-300 text-[9px] px-2 py-0.5 rounded-full border border-emerald-800/60 font-mono">
                    VERIFICADO
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 font-mono">
                  SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS.
                </p>
                <p className="text-[9px] text-[#c5a059] font-mono truncate max-w-sm sm:max-w-md">
                  HASH: INNMEX-CERT-2026-{cotizacion.numero}-AUTH-MINI-REY-IA-VALIDATED-OK
                </p>
              </div>
            </div>

            {/* Emisor Badge */}
            <div className="text-right text-[10px] text-stone-400 font-mono border-t sm:border-t-0 sm:border-l border-[#1a1a1a] pt-2 sm:pt-0 sm:pl-4 self-stretch sm:self-auto flex flex-col justify-center">
              <span className="text-stone-300 font-bold uppercase">Emisor Autorizado:</span>
              <span className="text-[#c5a059]">INNMEX SOLUCIONES S.A. DE C.V.</span>
              <span>Cadena Original de Presupuesto</span>
            </div>

          </div>
        </div>

        {/* Signatures for formal approval */}
        <div className="pt-8 pb-4 border-t border-[#1a1a1a] grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-b border-[#c5a059]/40 w-4/5 mx-auto mb-2" />
            <p className="font-serif italic font-bold text-white uppercase text-xs sm:text-sm tracking-wider">
              EJECUTIVO COMERCIAL AUTORIZADO
            </p>
            <p className="text-[10px] text-[#c5a059] font-medium mt-0.5">INNMEX SOLUCIONES • Mini Rey IA</p>
          </div>

          <div>
            <div className="border-b border-stone-700 w-4/5 mx-auto mb-2" />
            <p className="font-serif italic font-bold text-white uppercase text-xs sm:text-sm tracking-wider">
              {cotizacion.clienteNombre}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Firma de Conformidad / Aceptación</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-6 text-[10px] text-stone-400 border-t border-[#1a1a1a]">
          Documento digital oficial y sello emitido por INNMEX SOLUCIONES • SISTEMA MINI REY IA ASISTENTE CONSULTOR EN GESTIÓN Y COTIZADOR DE PRESUPUESTOS. • Impreso desde dispositivo Android / Web
        </div>

      </div>

    </div>
  );
};
