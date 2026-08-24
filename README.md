# موقع منظومة

موقع عربي ثابت مبني بـ Next.js App Router وTypeScript وTailwind CSS، ومهيأ للعمل باتجاه RTL والتصدير الثابت.

## تعديل المحتوى

جميع النصوص والبيانات القابلة للتعديل موجودة في `content/site.json`. ألوان الموقع وأحجام الخط والمسافات والحركة موجودة في `design-tokens.ts`.

## عناصر تحتاج إلى استكمال

- `[[SITE_URL]]` في `content/site.json` ضمن `seo.siteUrl`: ضع رابط النطاق النهائي. يؤثر في الرابط الأساسي وOpen Graph وخريطة الموقع وrobots.txt.
- `[[ORGANIZATIONS_SERVED]]` في `content/site.json` ضمن `metrics.items`: ضع عدد الجهات المخدومة عند اعتماده.
- `[[PROJECTS_DELIVERED]]` في `content/site.json` ضمن `metrics.items`: ضع عدد المشاريع المنجزة عند اعتماده.
- `[[CONTRACT_VALUE_SUPPORTED]]` في `content/site.json` ضمن `metrics.items`: ضع قيمة العقود المدعومة عند اعتمادها.

قسم المؤشرات لا يظهر إطلاقاً ما دامت القيم الثلاث أعلاه غير مكتملة. ويمكن تعبئة قيمة واحدة فقط ليظهر ذلك المؤشر وحده.

## التشغيل والبناء

```bash
npm install
npm run dev
npm run build
```

النموذج لا يحتاج إلى بريد أو خادم. بعد التحقق من رقم الجوال السعودي، ينشئ رسالة واتساب مرتبة إلى رقم منظومة.
