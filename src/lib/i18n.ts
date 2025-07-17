
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
      title: 'Your Bespoke Car Dealer',
      subtitle: '',
      alt: 'Desert landscape with a modern car'
    },
  },
  ar: {
    header: {
      brand: 'جولف كار إكس',
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
      title: 'وكيل سياراتك الخاص',
      subtitle: '',
      alt: 'منظر طبيعي صحراوي به سيارة حديثة'
    },
  },
};

export const getDictionary = (lang: Language) => dictionaries[lang];
