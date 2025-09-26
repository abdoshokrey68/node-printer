/**
 * وظائف قطع الورقة للطابعات الحرارية
 */

const { exec } = require("child_process");
const util = require("util");
const fs = require("fs");
const path = require("path");
const config = require("../config/print-config");

const execAsync = util.promisify(exec);

/**
 * إرسال أمر قطع الورقة للطابعة الحرارية
 * @param {string} printerName - اسم الطابعة المحلية
 * @param {string} printer_ip - عنوان IP للطابعة
 * @returns {Promise<void>}
 */
async function cutPaper(printerName, printer_ip) {
  try {
    if (printer_ip) {
      console.log("أمر قطع الورقة للطابعة الشبكية غير مطبق بعد");
      return;
    }

    if (!printerName) {
      console.log("اسم الطابعة غير محدد");
      return;
    }

    // محاولة قطع الورقة عبر PowerShell
    await cutPaperViaPowerShell(printerName);
  } catch (error) {
    console.log("فشل أمر قطع الورقة:", error.message);
  }
}

/**
 * قطع الورقة عبر PowerShell
 * @param {string} printerName - اسم الطابعة
 * @returns {Promise<void>}
 */
async function cutPaperViaPowerShell(printerName) {
  try {
    const command = `powershell -Command "Add-Type -AssemblyName System.Drawing; $printer = '${printerName}'; $bytes = [byte[]](0x1b, 0x64, 0x02); [System.IO.File]::WriteAllBytes('cut_command.bin', $bytes); Get-Content 'cut_command.bin' -Raw | Out-Printer -Name '$printer'; Remove-Item 'cut_command.bin'"`;

    await execAsync(command);
    console.log("تم إرسال أمر قطع الورقة عبر PowerShell");
  } catch (psError) {
    console.log("فشل أمر قطع الورقة عبر PowerShell، جاري تجربة طريقة بديلة");
    await cutPaperViaCopy(printerName);
  }
}

/**
 * قطع الورقة عبر أمر copy
 * @param {string} printerName - اسم الطابعة
 * @returns {Promise<void>}
 */
async function cutPaperViaCopy(printerName) {
  try {
    const cutFile = path.join(__dirname, "..", "temp", "cut_command.bin");

    // إنشاء مجلد temp إذا لم يكن موجوداً
    const tempDir = path.dirname(cutFile);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(cutFile, config.ESC_POS.CUT_PAPER);

    const copyCommand = `copy /b "${cutFile}" "\\\\localhost\\${printerName}"`;
    await execAsync(copyCommand);

    fs.unlinkSync(cutFile);
    console.log("تم إرسال أمر قطع الورقة عبر أمر copy");
  } catch (copyError) {
    console.log("فشل أمر copy:", copyError.message);
    console.log("لم يتمكن من إرسال أمر قطع الورقة");
  }
}

module.exports = {
  cutPaper,
};
