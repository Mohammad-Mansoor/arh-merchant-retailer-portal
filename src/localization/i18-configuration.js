import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ps from "./locales/ps.json";
import fa from "./locales/fa.json";

const resources = {
  en: { translation: en },
  ps: { translation: ps },
  fa: { translation: fa },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Initializes react-i18next
  .init({
    resources,
    fallbackLng: "en", // Default language
    debug: true, // Enable debug mode in development
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
  });

export default i18n;
