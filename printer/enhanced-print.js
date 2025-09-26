/**
 * واجهة الطباعة المحسنة (للتوافق مع الإصدارات القديمة)
 */

const { printInvoice } = require("../services/printer-service");

/**
 * طباعة من محتوى HTML
 * @param {Object} options - خيارات الطباعة
 * @param {string} options.htmlContent - محتوى HTML
 * @param {string} [options.printerName] - اسم الطابعة
 * @param {string} [options.printer_ip] - عنوان IP للطابعة
 * @param {number} [options.widthMm] - عرض الورق بالمليمتر
 * @param {boolean} [options.cutPaper] - قطع الورقة بعد الطباعة
 * @returns {Promise<Object>} نتيجة الطباعة
 */
async function printFromHTML(options) {
  return await printInvoice({
    htmlContent: options.htmlContent,
    printerName: options.printerName,
    printer_ip: options.printer_ip,
    widthMm: options.widthMm,
    cutPaper: options.cutPaper,
  });
}

/**
 * طباعة من URL
 * @param {Object} options - خيارات الطباعة
 * @param {string} options.invoiceUrl - رابط الفاتورة
 * @param {string} [options.printerName] - اسم الطابعة
 * @param {string} [options.printer_ip] - عنوان IP للطابعة
 * @param {number} [options.widthMm] - عرض الورق بالمليمتر
 * @param {boolean} [options.cutPaper] - قطع الورقة بعد الطباعة
 * @returns {Promise<Object>} نتيجة الطباعة
 */
async function printFromURL(options) {
  return await printInvoice({
    invoiceUrl: options.invoiceUrl,
    printerName: options.printerName,
    printer_ip: options.printer_ip,
    widthMm: options.widthMm,
    cutPaper: options.cutPaper,
  });
}

module.exports = {
  printFromHTML,
  printFromURL,
};
