import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
import es from "./locales/es.json";
import pt from "./locales/pt.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import hi from "./locales/hi.json";
import id from "./locales/id.json";
import vi from "./locales/vi.json";
import th from "./locales/th.json";
import ru from "./locales/ru.json";
import tr from "./locales/tr.json";
import ar from "./locales/ar.json";

const savedLang = await browser.storage.local
  .get("yt-lang")
  .then((r) => r["yt-lang"] as string | undefined)
  .catch(() => undefined);

const langMap: Record<string, string> = {
  ko: "ko",
  ja: "ja",
  zh: "zh-CN",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  "zh-HK": "zh-TW",
  es: "es",
  pt: "pt",
  de: "de",
  fr: "fr",
  hi: "hi",
  id: "id",
  vi: "vi",
  th: "th",
  ru: "ru",
  tr: "tr",
  ar: "ar",
};

const browserLang = navigator.language;
const systemLang =
  langMap[browserLang] ?? langMap[browserLang.split("-")[0]] ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
    ja: { translation: ja },
    "zh-CN": { translation: zhCN },
    "zh-TW": { translation: zhTW },
    es: { translation: es },
    pt: { translation: pt },
    de: { translation: de },
    fr: { translation: fr },
    hi: { translation: hi },
    id: { translation: id },
    vi: { translation: vi },
    th: { translation: th },
    ru: { translation: ru },
    tr: { translation: tr },
    ar: { translation: ar },
  },
  lng: savedLang ?? systemLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
