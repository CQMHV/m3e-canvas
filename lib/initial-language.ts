import { isLang, type Lang } from "./i18n";

/** Storage may be unavailable or malformed; neither should prevent startup. */
export function initialLanguage(readUi: () => string | null, browserLanguage: string): Lang {
  try {
    const ui = JSON.parse(readUi() ?? "null");
    if (isLang(ui?.lang)) return ui.lang;
  } catch {}
  const language = browserLanguage.toLowerCase();
  return language.startsWith("zh") ? "zh" : language.startsWith("ko") ? "ko" : language.startsWith("ja") ? "ja" : "en";
}
