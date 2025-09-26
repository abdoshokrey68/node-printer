/**
 * واجهة الطباعة التقليدية (للتوافق مع الإصدارات القديمة)
 */

const { printInvoice } = require("../services/legacy-printer");

module.exports = {
  printInvoice,
};
