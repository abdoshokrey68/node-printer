/**
 * خدمة إنشاء ملفات PDF
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const config = require("../config/print-config");
const { injectThermalCSS } = require("../utils/css-injector");
const { mmToPx, calculateHeightMm } = require("../utils/unit-converter");

/**
 * إنشاء ملف PDF من محتوى HTML
 * @param {string} htmlContent - محتوى HTML
 * @param {Object} options - خيارات إضافية
 * @param {number} [options.widthMm] - عرض الورق بالمليمتر
 * @param {string} [options.contentSelector] - محدد CSS للحاوية الرئيسية
 * @param {string} [options.outputPath] - مسار ملف PDF المخصص
 * @returns {Promise<string>} مسار ملف PDF المُنشأ
 */
async function generatePDF(htmlContent, options = {}) {
  const {
    widthMm = config.PAPER.DEFAULT_WIDTH_MM,
    contentSelector = ".invoice-container",
    outputPath,
  } = options;

  const browser = await puppeteer.launch({
    headless: true,
    args: config.PUPPETEER.ARGS,
    executablePath: config.PUPPETEER.EXECUTABLE_PATH,
  });

  try {
    const page = await browser.newPage();
    const widthPx = mmToPx(widthMm);

    // تعيين عرض العرض ليتطابق مع عرض الورق الحراري
    await page.setViewport({
      width: widthPx,
      height: 1200,
      deviceScaleFactor: 1,
    });

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // حقن CSS لضبط التخطيط
    await injectThermalCSS(page);

    // تطبيق أنماط الطباعة
    await page.emulateMediaType("print");

    // انتظار تحميل الخطوط والصور
    await new Promise((resolve) => setTimeout(resolve, 300));

    // حساب ارتفاع المحتوى الفعلي
    const contentHeightPx = await page.evaluate((selector) => {
      const el = document.querySelector(selector) || document.body;
      return Math.max(
        el.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
    }, contentSelector);

    const heightMm = calculateHeightMm(contentHeightPx);

    console.log(`PDF dimensions: ${widthMm}mm x ${heightMm}mm`);

    const pdfPath =
      outputPath || path.join(__dirname, "..", "temp", "output.pdf");

    // إنشاء مجلد temp إذا لم يكن موجوداً
    const tempDir = path.dirname(pdfPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // إعدادات PDF محسنة للطباعة على طابعات الفواتير
    await page.pdf({
      path: pdfPath,
      width: `${widthMm}mm`,
      height: `${heightMm}mm`,
      ...config.PDF.MARGIN,
      ...config.PDF.OPTIONS,
    });

    return pdfPath;
  } finally {
    await browser.close();
  }
}

module.exports = {
  generatePDF,
};
