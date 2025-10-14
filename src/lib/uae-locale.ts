// UAE-specific localization utilities

export const UAE_CONFIG = {
  currency: 'AED',
  currencySymbol: 'د.إ',
  timezone: 'Asia/Dubai',
  timezoneOffset: '+04:00',
  locale: 'en-AE',
  localeAr: 'ar-AE',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  weekStart: 0, // Sunday
  weekendDays: [5, 6], // Friday, Saturday
  workingDays: [0, 1, 2, 3, 4], // Sunday-Thursday
};

export const UAE_EMIRATES = [
  { value: 'dubai', label: 'Dubai', label_ar: 'دبي' },
  { value: 'abu-dhabi', label: 'Abu Dhabi', label_ar: 'أبو ظبي' },
  { value: 'sharjah', label: 'Sharjah', label_ar: 'الشارقة' },
  { value: 'ajman', label: 'Ajman', label_ar: 'عجمان' },
  { value: 'ras-al-khaimah', label: 'Ras Al Khaimah', label_ar: 'رأس الخيمة' },
  { value: 'fujairah', label: 'Fujairah', label_ar: 'الفجيرة' },
  { value: 'umm-al-quwain', label: 'Umm Al Quwain', label_ar: 'أم القيوين' },
];

export const POPULAR_VENUES = [
  'Burj Khalifa',
  'Dubai Opera',
  'Madinat Jumeirah',
  'Atlantis The Palm',
  'Emirates Palace',
  'Dubai World Trade Centre',
  'Dubai Festival City',
  'La Mer',
  'City Walk',
  'The Beach JBR',
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', label_ar: 'الإنجليزية' },
  { value: 'ar', label: 'Arabic', label_ar: 'العربية' },
  { value: 'both', label: 'Bilingual (English & Arabic)', label_ar: 'ثنائي اللغة (الإنجليزية والعربية)' },
];

export const formatCurrency = (amount: number, locale: string = 'en'): string => {
  if (locale === 'ar') {
    return `${amount.toLocaleString('ar-AE')} ${UAE_CONFIG.currencySymbol}`;
  }
  return `${UAE_CONFIG.currencySymbol} ${amount.toLocaleString('en-AE')}`;
};

export const formatTime = (time: string, locale: string = 'en'): string => {
  // Convert 24h time to 12h format for English
  if (locale === 'en') {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  return time; // Arabic uses 24h format
};

export const getDayName = (dayIndex: number, locale: string = 'en'): string => {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  
  return locale === 'ar' ? daysAr[dayIndex] : daysEn[dayIndex];
};

export const isWeekend = (dayIndex: number): boolean => {
  return UAE_CONFIG.weekendDays.includes(dayIndex);
};

export const isWorkingDay = (dayIndex: number): boolean => {
  return UAE_CONFIG.workingDays.includes(dayIndex);
};

export const getBusinessHours = () => ({
  start: '09:00',
  end: '18:00',
  timezone: UAE_CONFIG.timezone,
});

export const validatePhoneNumber = (phone: string): boolean => {
  // UAE phone numbers: +971-XX-XXX-XXXX or 05X-XXX-XXXX
  const uaePhoneRegex = /^(?:\+971|00971|0)?(?:50|51|52|54|55|56|58|2|3|4|6|7|9)\d{7}$/;
  return uaePhoneRegex.test(phone.replace(/[\s-]/g, ''));
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+971')) {
    return cleaned.replace(/(\+971)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
  if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
};