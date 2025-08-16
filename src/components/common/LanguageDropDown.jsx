import { useState } from "react";
import { useTranslation } from "react-i18next";


const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.language;

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "ps", name: "پښتو", flag: "🇦🇫" }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Change language"
      >
        <span className="text-xl">{currentLanguage?.flag}</span>
      </button>

 
      <div 
        className={`absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-50 ${
          isOpen 
            ? "opacity-100 transform translate-y-0" 
            : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                currentLang === lang.code
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              <span className="text-xl mr-3">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {currentLang === lang.code && (
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default LanguageDropdown;