/**
 * التطبيق الرئيسي - نظام طباعة الفواتير
 */

const listenToPrintEvent = require("./pusher/listen");
const { generatePDF } = require("./services/pdf-generator");
const {
  printInvoice: legacyPrintInvoice,
} = require("./services/legacy-printer");
const { printInvoice } = require("./services/printer-service");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")({ sigint: true });
const dotenv = require("dotenv");

console.log("PosPrinter started...");
dotenv.config();

/**
 * جلب المحتوى من URL
 * @param {string} url - رابط المحتوى
 * @returns {Promise<string>} محتوى HTML
 */
async function fetchContentFromURL(url) {
  try {
    console.log(`Fetching content from URL: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.text();
    console.log("Content fetched successfully from URL");
    return content;
  } catch (err) {
    console.error("Error fetching content from URL:", err);
    throw err;
  }
}

/**
 * معالجة طلب الطباعة
 * @param {Object} options - خيارات الطباعة
 * @param {string} [options.printerName] - اسم الطابعة المحلية
 * @param {string} [options.printer_ip] - عنوان IP للطابعة
 * @param {string} [options.content] - محتوى HTML للطباعة
 * @param {string} [options.url] - رابط لجلب المحتوى
 * @param {string} [options.invoiceUrl] - رابط مباشر للفاتورة
 * @param {boolean} [options.useEnhanced] - استخدام الطابعة المحسنة
 */
async function handlePrint({
  printerName,
  printer_ip,
  content,
  url,
  invoiceUrl,
  useEnhanced = true,
}) {
  try {
    console.log("Starting print job...");

    if (useEnhanced) {
      // استخدام الطابعة المحسنة
      if (invoiceUrl) {
        console.log(`Printing directly from URL: ${invoiceUrl}`);
        await printInvoice({
          invoiceUrl,
          printerName,
          printer_ip,
        });
      } else if (url) {
        console.log(`Fetching content from URL: ${url}`);
        const htmlContent = await fetchContentFromURL(url);
        await printInvoice({
          htmlContent,
          printerName,
          printer_ip,
        });
      } else if (content) {
        console.log("Printing from HTML content");
        await printInvoice({
          htmlContent: content,
          printerName,
          printer_ip,
        });
      } else {
        throw new Error("No content, URL, or invoiceUrl provided");
      }
    } else {
      // استخدام الطريقة التقليدية
      let htmlContent = content;

      if (!htmlContent && url) {
        htmlContent = await fetchContentFromURL(url);
      }

      if (!htmlContent) {
        throw new Error("No content provided and no URL specified");
      }

      const pdfPath = await generatePDF(htmlContent);
      await legacyPrintInvoice({ printerName, printer_ip, pdfPath });
    }

    console.log("Print job completed successfully!");
  } catch (err) {
    console.error("Error during print process:", err);
    throw err;
  }
}

/**
 * تسجيل الدخول
 */
async function login() {
  const email = prompt("Enter Your Email: ");
  const password = prompt.hide("Enter Your Password: ");

  let base_uri = process.env.LOCAL_URI;
  const response = await fetch(`${base_uri}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (data.status === "success") {
    console.info("Login Successfully");
    listenToPrintEvent(handlePrint, data.data.channel_name);
  } else {
    console.error(data.message);
    console.error("Invalid Credentials .. Please Try Again");
    login();
  }
}

login();
