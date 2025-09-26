/**
 * تحويل الوحدات للطباعة
 */

/**
 * تحويل المليمتر إلى بكسل (افتراض 96 DPI)
 * @param {number} mm - المليمتر
 * @returns {number} البكسل
 */
function mmToPx(mm) {
  return Math.round((mm / 25.4) * 96);
}

/**
 * تحويل البكسل إلى مليمتر (افتراض 96 DPI)
 * @param {number} px - البكسل
 * @returns {number} المليمتر
 */
function pxToMm(px) {
  return (px * 25.4) / 96;
}

/**
 * حساب ارتفاع المحتوى بالمليمتر
 * @param {number} contentHeightPx - ارتفاع المحتوى بالبكسل
 * @param {number} safetyPaddingMm - هامش الأمان بالمليمتر
 * @returns {number} الارتفاع بالمليمتر
 */
function calculateHeightMm(contentHeightPx, safetyPaddingMm = 2) {
  return Math.ceil(pxToMm(contentHeightPx) + safetyPaddingMm);
}

module.exports = {
  mmToPx,
  pxToMm,
  calculateHeightMm,
};
