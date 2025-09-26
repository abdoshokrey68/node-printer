/**
 * حقن CSS لضبط تخطيط الطباعة الحرارية
 */

/**
 * CSS محسن للطباعة الحرارية
 */
const THERMAL_CSS = `
  * {
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  body {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Courier New', monospace !important;
    font-size: 12px !important;
    line-height: 1.2 !important;
    overflow-x: hidden !important;
    display: flex !important;
    justify-content: center !important;
    align-items: flex-start !important;
  }
  
  .invoice-container, .receipt-container, .print-container {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 1px 2px !important;
    text-align: center !important;
  }
  
  h1, h2, h3, h4, h5, h6, p {
    margin: 1px 0 !important;
    text-align: center !important;
  }
  
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 0 !important;
  }
  
  td, th {
    padding: 2px 0 !important;
    border: none !important;
    margin: 0 !important;
  }
  
  .header_color {
    background-color: #ddd !important;
  }
  
  tr {
    border-bottom: 1px dotted #000 !important;
  }
  
  img {
    max-width: 100% !important;
    height: auto !important;
  }
`;

/**
 * حقن CSS في الصفحة
 * @param {Object} page - صفحة Puppeteer
 * @returns {Promise<void>}
 */
async function injectThermalCSS(page) {
  await page.addStyleTag({
    content: THERMAL_CSS,
  });
}

module.exports = {
  injectThermalCSS,
  THERMAL_CSS,
};
