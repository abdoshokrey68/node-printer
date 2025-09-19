// index.js

const listenToPrintEvent = require("./pusher/listen");
const generatePDF = require("./pdf/generate");
const printInvoice = require("./printer/print");
const fetch = require("node-fetch");

console.log("PosPrinter started...");

// دالة لجلب البيانات من URL
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

// الدالة الأساسية لمعالجة بيانات الطباعة
async function handlePrint({ printerName, printer_ip, content, url }) {
  try {
    console.log("Received print data:", {
      printerName,
      printer_ip,
      content,
      url,
    });

    let htmlContent = content;

    // إذا لم يكن هناك محتوى، احصل عليه من URL
    if (!htmlContent && url) {
      htmlContent = await fetchContentFromURL(url);
    }

    if (!htmlContent) {
      throw new Error("No content provided and no URL specified");
    }

    // 1. أنشئ ملف PDF مؤقت
    const pdfPath = await generatePDF(htmlContent);

    // 2. اطبع الملف على الطابعة المطلوبة
    await printInvoice({ printerName, printer_ip, pdfPath });

    console.log("Printed successfully!");
  } catch (err) {
    console.error("Error during print process:", err);
  }
}

// استمع للأحداث من Pusher
listenToPrintEvent(handlePrint);

// للاختبار اليدوي بدون Pusher
// if (process.env.TEST_PRINT === "1") {
// setTimeout(() => {
//   // مثال 1: طباعة بمحتوى HTML مباشر
//   handlePrint({
//     printerName: "Microsoft Print to PDF",
//     content: `
//       <html>
//         <body>
//           <h1>فاتورة جديدة</h1>
//           <p>تفاصيل الفاتورة هنا...</p>
//         </body>
//       </html>
//     `,
//   });
//
//   // مثال 2: طباعة من URL
//   handlePrint({
//     printer_ip: "192.168.1.100",
//     url: "http://localhost:8000/sales/gen_invoice/3394"
//   });
// }, 2000);
// }
