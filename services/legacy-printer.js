/**
 * خدمة الطباعة التقليدية (للتوافق مع الإصدارات القديمة)
 */

const printer = require("pdf-to-printer");
const fs = require("fs");
const path = require("path");
const { cutPaper } = require("../utils/paper-cutter");

/**
 * طباعة ملف PDF على الطابعة المحددة
 * @param {Object} options - خيارات الطباعة
 * @param {string} [options.printerName] - اسم الطابعة المحلية
 * @param {string} [options.printer_ip] - عنوان IP للطابعة
 * @param {string} options.pdfPath - مسار ملف PDF للطباعة
 * @param {boolean} [options.cleanup] - حذف ملف PDF بعد الطباعة
 * @param {boolean} [options.cutPaper] - قطع الورقة بعد الطباعة
 * @returns {Promise<void>}
 */
const printInvoice = async ({
  printerName,
  printer_ip,
  pdfPath,
  cleanup = true,
  cutPaper = true,
}) => {
  try {
    // التحقق من وجود ملف PDF
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found: ${pdfPath}`);
    }

    let options = {};

    // تحديد الطابعة - إعطاء الأولوية لـ printer_ip
    if (printer_ip) {
      options.printer = `\\\\${printer_ip}\\PrinterShareName`;
      console.log(`Using network printer IP: ${printer_ip}`);
    } else if (printerName) {
      options.printer = printerName;
      console.log(`Using local printer name: ${printerName}`);
    } else {
      throw new Error(
        "No printer specified (neither printerName nor printer_ip)"
      );
    }

    console.log(`Sending PDF to printer: ${pdfPath}`);
    await printer.print(pdfPath, options);
    console.log(
      `Invoice sent successfully to printer [${printer_ip || printerName}]`
    );

    // إرسال أمر قطع الورقة بعد الطباعة (إذا كان مفعلاً)
    if (cutPaper) {
      await cutPaper(printerName, printer_ip);
      console.log("تم إرسال أمر قطع الورقة");
    } else {
      console.log("قطع الورقة معطل");
    }

    // تنظيف ملف PDF المؤقت إذا طُلب ذلك
    if (cleanup) {
      try {
        fs.unlinkSync(pdfPath);
        console.log(`Temporary PDF file cleaned up: ${pdfPath}`);
      } catch (cleanupError) {
        console.warn(`Failed to cleanup PDF file: ${cleanupError.message}`);
      }
    }
  } catch (err) {
    console.error("Error printing invoice:", err);

    // محاولة تنظيف ملف PDF في حالة الخطأ
    if (cleanup && pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
        console.log(`PDF file cleaned up after error: ${pdfPath}`);
      } catch (cleanupError) {
        console.warn(
          `Failed to cleanup PDF file after error: ${cleanupError.message}`
        );
      }
    }

    throw err;
  }
};

module.exports = {
  printInvoice,
};
