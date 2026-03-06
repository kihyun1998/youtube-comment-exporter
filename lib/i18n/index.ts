import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";

const savedLang = await browser.storage.local
  .get("yt-lang")
  .then((r) => r["yt-lang"] as string | undefined)
  .catch(() => undefined);

const systemLang = navigator.language.startsWith("ko") ? "ko" : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: savedLang ?? systemLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
