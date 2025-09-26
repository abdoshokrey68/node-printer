/**
 * إعدادات الطباعة العامة
 */

module.exports = {
  // إعدادات الورق الحرارية
  PAPER: {
    DEFAULT_WIDTH_MM: 70,
    COMMON_WIDTHS: [58, 70, 80],
    DPI: 96,
  },

  // إعدادات الطابعة
  PRINTER: {
    DEFAULT_NAME: "XP-80C (copy 1)",
    TIMEOUT: 60000,
  },

  // أوامر ESC/POS
  ESC_POS: {
    CUT_PAPER: Buffer.from([0x1b, 0x64, 0x02]), // ESC d 2
    FEED_LINES: Buffer.from([0x1b, 0x64, 0x03]), // ESC d 3
  },

  // إعدادات Puppeteer
  PUPPETEER: {
    ARGS: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    EXECUTABLE_PATH:
      process.env.CHROME_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },

  // إعدادات PDF
  PDF: {
    MARGIN: { top: 0, bottom: 0, left: 0, right: 0 },
    OPTIONS: {
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      scale: 1.0,
      format: undefined,
      landscape: false,
    },
  },
};
