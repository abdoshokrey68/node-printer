// pdf/generate.js

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ضع الـ HTML في الصفحة
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // مسار ملف PDF المؤقت
  const pdfPath = path.join(__dirname, "output.pdf");

  // أنشئ الـ PDF
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath;
}

module.exports = generatePDF;
