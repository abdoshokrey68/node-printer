const printer = require("pdf-to-printer");

const printInvoice = async ({ printerName, printer_ip, pdfPath }) => {
  try {
    let options = {};

    // تحديد الطابعة - إعطاء الأولوية لـ printer_ip
    if (printer_ip) {
      // استخدام IP الطابعة - يمكن تخصيص هذا حسب نوع الطابعة
      // بعض الطابعات تحتاج UNC path مثل: \\192.168.1.100\PrinterShareName
      // أو يمكن استخدام بروتوكول RAW/LPR
      options.printer = `\\\\${printer_ip}\\PrinterShareName`;
      console.log(`Using printer IP: ${printer_ip}`);
    } else if (printerName) {
      options.printer = printerName;
      console.log(`Using printer name: ${printerName}`);
    } else {
      throw new Error(
        "No printer specified (neither printerName nor printer_ip)"
      );
    }

    await printer.print(pdfPath, options);
    console.log(`Invoice sent to printer [${printer_ip || printerName}]`);
  } catch (err) {
    console.error("Error printing invoice:", err);
    throw err;
  }
};

module.exports = printInvoice;
