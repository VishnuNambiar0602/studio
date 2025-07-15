import type { Language } from './types';

const dictionaries = {
  en: {
    header: {
      brand: 'GulfCarX',
      newParts: 'New Parts',
      usedParts: 'Used Parts',
      oemParts: 'OEM',
      cart: 'Shopping Cart',
      myAccount: 'My Account',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Sign Up / Login',
    },
    hero: {
      title: 'The Future of Auto Parts, Realized',
      subtitle: 'Your AI-powered platform for high-quality used, OEM, and new car parts across the Sultanate.',
      alt: 'Desert landscape with ancient ruins and a modern car'
    },
  },
  ar: {
    header: {
      brand: 'جلف كار إكس',
      newParts: 'قطع غيار جديدة',
      usedParts: 'قطع غيار مستعملة',
      oemParts: 'قطع غيار أصلية',
      cart: 'عربة التسوق',
      myAccount: 'حسابي',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول / إنشاء حساب',
    },
    hero: {
      title: 'مستقبل قطع غيار السيارات، أصبح حقيقة',
      subtitle: 'منصتك المدعومة بالذكاء الاصطناعي لقطع غيار السيارات المستعملة والجديدة والأصلية عالية الجودة في جميع أنحاء السلطنة.',
      alt: 'منظر طبيعي صحراوي به أطلال قديمة وسيارة حديثة'
    },
  },
};

export const getDictionary = (lang: Language) => dictionaries[lang];
