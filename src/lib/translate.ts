// Simple translation mappings for common product terms
// In a production app, you'd use a proper translation API or database

const productTranslations: Record<string, string> = {
  // Product names
  "Used Alternator - Honda Accord": "مولد مستعمل - هوندا أكورد",
  "OEM Brake Pads - Toyota Camry": "فرامل أصلية - تويوتا كامري",
  "K&N Performance Air Filter": "فلتر هواء عالي الأداء K&N",
  "Denso Iridium Spark Plugs (4-pack)": "شمعات إشعال إيريديوم دينسو (4 قطع)",
  "Used Radiator - Nissan Patrol Y61": "رادياتير مستعمل - نيسان باترول Y61",
  
  // Descriptions
  "A tested and fully functional used alternator pulled from a 2019 Honda Accord. 90-day warranty included": "مولد مستعمل تم اختباره ويعمل بشكل كامل من هوندا أكورد 2019. يشمل ضمان 90 يومًا",
  "High-quality original equipment manufacturer brake pads for superior stopping power and longevity. Fits Toyota Camry 2018-2023 models": "فرامل أصلية عالية الجودة من الشركة المصنعة للمعدات الأصلية لقوة توقف فائقة وطول العمر. تناسب موديلات تويوتا كامري 2018-2023",
  "Washable and reusable high-flow air filter. Increases horsepower and acceleration. A simple upgrade for any car enthusiast": "فلتر هواء عالي التدفق قابل للغسل وإعادة الاستخدام. يزيد من قوة الحصان والتسارع. ترقية بسيطة لأي عشاق السيارات",
  "Set of four iridium spark plugs for improved fuel efficiency and performance. Fits most 4-cylinder engines": "مجموعة من أربع شمعات إشعال إيريديوم لتحسين كفاءة الوقود والأداء. تناسب معظم المحركات ذات 4 أسطوانات",
  "Used OEM radiator for Nissan Patrol Y61. Pressure tested and rust-free. Great value for money": "رادياتير أصلي مستعمل لنيسان باترول Y61. تم اختباره بالضغط وخالي من الصدأ. قيمة رائعة مقابل المال",
  
  // Vendor names
  "Salalah Auto Spares®": "صلالة لقطع غيار السيارات®",
  "Muscat Modern Auto®": "مسقط للسيارات الحديثة®",
};

export function translateText(text: string, targetLang: 'ar' | 'en'): string {
  if (targetLang === 'en') {
    return text; // Original text is in English
  }
  
  // Check for exact match
  if (productTranslations[text]) {
    return productTranslations[text];
  }
  
  // Check for partial matches (for descriptions that might vary slightly)
  for (const [key, value] of Object.entries(productTranslations)) {
    if (text.includes(key)) {
      return text.replace(key, value);
    }
  }
  
  // If no translation found, return original
  return text;
}
