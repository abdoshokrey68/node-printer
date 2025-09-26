/**
 * خدمة الطباعة الرئيسية
 */

const puppeteer = require("puppeteer");
const printer = require("pdf-to-printer");
const path = require("path");
const fs = require("fs");
const config = require("../config/print-config");
const { injectThermalCSS } = require("../utils/css-injector");
const { mmToPx, calculateHeightMm } = require("../utils/unit-converter");
const { cutPaper: cutPaperFunction } = require("../utils/paper-cutter");

/**
 * طباعة فاتورة من HTML أو URL
 * @param {Object} options - خيارات الطباعة
 * @param {string} [options.invoiceUrl] - رابط الفاتورة
 * @param {string} [options.htmlContent] - محتوى HTML
 * @param {string} [options.printerName] - اسم الطابعة المحلية
 * @param {string} [options.printer_ip] - عنوان IP للطابعة
 * @param {string} [options.tmpPdfPath] - مسار PDF مؤقت مخصص
 * @param {number} [options.widthMm] - عرض الورق بالمليمتر
 * @param {string} [options.contentSelector] - محدد CSS للحاوية
 * @param {boolean} [options.cutPaper] - قطع الورقة بعد الطباعة
 * @returns {Promise<Object>} نتيجة الطباعة
 */
async function printInvoice(options = {}) {
  const {
    invoiceUrl,
    htmlContent,
    printerName,
    printer_ip,
    tmpPdfPath,
    widthMm = config.PAPER.DEFAULT_WIDTH_MM,
    contentSelector = ".invoice-container",
    cutPaper = true,
  } = options;

  // التحقق من المدخلات
  if (!invoiceUrl && !htmlContent) {
    throw new Error("Either invoiceUrl or htmlContent must be provided");
  }

  const tmpPdf =
    tmpPdfPath ||
    path.join(__dirname, "..", "temp", `invoice-${Date.now()}.pdf`);
  const widthPx = mmToPx(widthMm);

  console.log(`Starting print job - Width: ${widthMm}mm (${widthPx}px)`);

  const browser = await puppeteer.launch({
    headless: true,
    args: config.PUPPETEER.ARGS,
    executablePath: config.PUPPETEER.EXECUTABLE_PATH,
  });

  try {
    const page = await browser.newPage();

    // تعيين عرض العرض ليتطابق مع عرض الورق الحراري
    await page.setViewport({
      width: widthPx,
      height: 1200,
      deviceScaleFactor: 1,
    });

    // تحميل المحتوى
    if (invoiceUrl) {
      console.log(`Loading content from URL: ${invoiceUrl}`);
      await page.goto(invoiceUrl, {
        waitUntil: "networkidle0",
        timeout: config.PRINTER.TIMEOUT,
      });
    } else {
      console.log("Loading HTML content");
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    }

    // حقن CSS لضبط التخطيط
    await injectThermalCSS(page);

    // تطبيق أنماط الطباعة
    await page.emulateMediaType("print");

    // انتظار تحميل الخطوط والصور
    await new Promise((resolve) => setTimeout(resolve, 500));

    // قياس ارتفاع المحتوى
    const contentHeightPx = await page.evaluate((selector) => {
      const el = document.querySelector(selector) || document.body;
      return Math.max(
        el.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
    }, contentSelector);

    const heightMm = calculateHeightMm(contentHeightPx);

    console.log(`Content height: ${contentHeightPx}px (${heightMm}mm)`);

    // إنشاء مجلد temp إذا لم يكن موجوداً
    const tempDir = path.dirname(tmpPdf);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // إنشاء PDF بأبعاد دقيقة
    await page.pdf({
      path: tmpPdf,
      width: `${widthMm}mm`,
      height: `${heightMm}mm`,
      ...config.PDF.MARGIN,
      ...config.PDF.OPTIONS,
    });

    await page.close();
    console.log(`PDF created: ${tmpPdf}`);

    // طباعة PDF
    const printOptions = {};
    if (printer_ip) {
      printOptions.printer = `\\\\${printer_ip}\\PrinterShareName`;
      console.log(`Printing to network printer: ${printer_ip}`);
    } else if (printerName) {
      printOptions.printer = printerName;
      console.log(`Printing to local printer: ${printerName}`);
    } else {
      throw new Error(
        "No printer specified (neither printerName nor printer_ip)"
      );
    }

    await printer.print(tmpPdf, printOptions);
    console.log("Print job sent successfully");

    // إرسال أمر قطع الورقة بعد الطباعة (إذا كان مفعلاً)
    if (cutPaper) {
      await cutPaperFunction(printerName, printer_ip);
      console.log("Paper cut command sent");
    } else {
      console.log("Paper cut disabled");
    }

    return { success: true, pdfPath: tmpPdf };
  } catch (error) {
    console.error("Error during print process:", error);
    throw error;
  } finally {
    await browser.close();

    // تنظيف ملف PDF المؤقت
    try {
      if (fs.existsSync(tmpPdf)) {
        fs.unlinkSync(tmpPdf);
        console.log("Temporary PDF file cleaned up");
      }
    } catch (cleanupError) {
      console.warn("Failed to cleanup temporary PDF:", cleanupError.message);
    }
  }
}

module.exports = {
  printInvoice,
};
