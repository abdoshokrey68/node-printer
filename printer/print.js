const printer = require("pdf-to-printer");

const printInvoice = async (printerName, pdfPath) => {
  try {
    await printer.print(pdfPath, { printer: printerName });
    console.log(`Invoice sent to printer [${printerName}]`);
  } catch (err) {
    console.error("Error printing invoice:", err);
    throw err;
  }
};

module.exports = printInvoice;
