// pdf/generate.js

// const puppeteer = require("puppeteer");

// async function generatePDF(htmlContent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // ضع الـ HTML في الصفحة
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   // مسار ملف PDF المؤقت
//   const pdfPath = path.join(__dirname, "output.pdf");

//   // أنشئ الـ PDF
//   await page.pdf({ path: pdfPath, format: "A4" });

//   await browser.close();
//   return pdfPath;
// }

// module.exports = generatePDF;

const puppeteer = require("puppeteer");
const path = require("path");

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfPath = path.join(__dirname, "output.pdf");
  await page.pdf({
    path: pdfPath,
    width: "80mm",
    height: "200mm",
    printBackground: true,
    margin: {
      top: "0mm",
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  });

  // await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath;
}

module.exports = generatePDF;
