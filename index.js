// index.js

const listenToPrintEvent = require("./pusher/listen");
const generatePDF = require("./pdf/generate");
const printInvoice = require("./printer/print");

console.log("PosPrinter started...");

// الدالة الأساسية لمعالجة بيانات الطباعة
async function handlePrint({ printerName, content }) {
  try {
    console.log("Received print data:", { printerName, content });

    // 1. أنشئ ملف PDF مؤقت
    const pdfPath = await generatePDF(content);

    // 2. اطبع الملف على الطابعة المطلوبة
    await printInvoice(printerName, pdfPath);

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
// }, 2000);
// }
