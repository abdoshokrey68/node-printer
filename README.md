# PosPrinter - نظام طباعة الفواتير

نظام طباعة الفواتير المحسن للطابعات الحرارية مع دعم قطع الورقة التلقائي.

## الميزات

- ✅ طباعة من HTML مباشر
- ✅ طباعة من URL
- ✅ دعم الطابعات المحلية والشبكية
- ✅ قطع الورقة التلقائي بعد الطباعة
- ✅ تخطيط محسن للورق الحراري
- ✅ دعم أبعاد ورق متعددة (58mm, 70mm, 80mm)
- ✅ معالجة أخطاء شاملة

## هيكل المشروع

```
PosPrinter/
├── config/                 # إعدادات المشروع
│   └── print-config.js     # إعدادات الطباعة العامة
├── services/               # الخدمات الرئيسية
│   ├── printer-service.js  # خدمة الطباعة المحسنة
│   ├── legacy-printer.js   # خدمة الطباعة التقليدية
│   └── pdf-generator.js    # خدمة إنشاء PDF
├── utils/                  # الأدوات المساعدة
│   ├── paper-cutter.js     # وظائف قطع الورقة
│   ├── css-injector.js     # حقن CSS للتخطيط
│   └── unit-converter.js   # تحويل الوحدات
├── printer/                # واجهات الطباعة (للتوافق)
│   ├── enhanced-print.js   # الطباعة المحسنة
│   └── print.js            # الطباعة التقليدية
├── pdf/                    # واجهات PDF (للتوافق)
│   └── generate.js         # إنشاء PDF
├── pusher/                 # استماع الأحداث
│   └── listen.js           # استماع Pusher
├── temp/                   # الملفات المؤقتة
├── index.js                # التطبيق الرئيسي
└── README.md               # هذا الملف
```

## التثبيت

```bash
npm install
```

## الاستخدام

### 1. الطباعة المحسنة (مستحسنة)

```javascript
const { printInvoice } = require("./services/printer-service");

// طباعة من HTML
await printInvoice({
  htmlContent: "<html>...</html>",
  printerName: "XP-80C (copy 1)",
  widthMm: 70,
  cutPaper: true,
});

// طباعة من URL
await printInvoice({
  invoiceUrl: "http://example.com/invoice",
  printerName: "XP-80C (copy 1)",
  widthMm: 70,
  cutPaper: true,
});
```

### 2. الطباعة التقليدية

```javascript
const { generatePDF } = require("./services/pdf-generator");
const { printInvoice } = require("./services/legacy-printer");

const pdfPath = await generatePDF(htmlContent);
await printInvoice({
  pdfPath,
  printerName: "XP-80C (copy 1)",
  cutPaper: true,
});
```

### 3. واجهات التوافق

```javascript
// الطباعة المحسنة
const { printFromHTML, printFromURL } = require("./printer/enhanced-print");

// الطباعة التقليدية
const { printInvoice } = require("./printer/print");

// إنشاء PDF
const { generatePDF } = require("./pdf/generate");
```

## الخيارات

### خيارات الطباعة

- `printerName` - اسم الطابعة المحلية
- `printer_ip` - عنوان IP للطابعة الشبكية
- `widthMm` - عرض الورق بالمليمتر (افتراضي: 70)
- `cutPaper` - قطع الورقة بعد الطباعة (افتراضي: true)
- `contentSelector` - محدد CSS للحاوية الرئيسية

### أبعاد الورق المدعومة

- 58mm - ورق حراري ضيق
- 70mm - ورق حراري متوسط (افتراضي)
- 80mm - ورق حراري عريض

## إعدادات البيئة

إنشاء ملف `.env`:

```env
LOCAL_URI=http://localhost:8000
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

## التشغيل

```bash
# تشغيل التطبيق
node index.js

# اختبار قطع الورقة
node test-paper-cut.js
```

## استكشاف الأخطاء

### مشاكل شائعة

1. **الطابعة غير موجودة**
   - تأكد من تثبيت الطابعة في Windows
   - تحقق من اسم الطابعة الصحيح

2. **قطع الورقة لا يعمل**
   - تأكد من دعم الطابعة لأوامر ESC/POS
   - جرب إلغاء قطع الورقة: `cutPaper: false`

3. **مشاكل التخطيط**
   - تأكد من استخدام CSS صحيح
   - تحقق من أبعاد الورق

### رسائل الخطأ

- `No printer specified` - لم يتم تحديد طابعة
- `PDF file not found` - ملف PDF غير موجود
- `Paper cut command failed` - فشل أمر قطع الورقة

## المساهمة

1. Fork المشروع
2. إنشاء branch جديد
3. Commit التغييرات
4. Push للـ branch
5. إنشاء Pull Request

## الترخيص

MIT License