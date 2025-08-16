import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ps from "./locales/ps.json";
import fa from "./locales/fa.json";


const directionMap = {
  en: "ltr",
  fa: "rtl",
  ps: "rtl",
};

const resources = {
  en: { translation: en },
  ps: { translation: ps },
  fa: { translation: fa },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "fa", "ps"],
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });


const applyDirection = (lng) => {
  const lang = lng.split("-")[0]; 
  const dir = directionMap[lang] || "ltr";
  document.documentElement.setAttribute("dir", dir);
};


const detectedLng = i18n.language || "en";
applyDirection(detectedLng);


i18n.on("languageChanged", (lng) => {
  applyDirection(lng);
});

export default i18n;