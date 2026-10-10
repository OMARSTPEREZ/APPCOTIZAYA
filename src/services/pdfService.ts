import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePdfFromElement = async (
  elementId: string,
  fileName: string = 'documento.pdf'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemento con ID #${elementId} no encontrado para generar PDF`);
    return false;
  }

  try {
    // Clonar temporalmente y ajustar opciones para captura nítida
    const canvas = await html2canvas(element, {
      scale: 2, // Calidad retina / alta resolución
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Agregar primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Agregar páginas subsiguientes si el contenido excede 1 página
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Error generando PDF:', err);
    return false;
  }
};

export const triggerPrint = () => {
  window.print();
};
