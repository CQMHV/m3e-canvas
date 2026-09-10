"use client";

import { LANGS, type Lang, t, type UIKey } from "../lib/i18n";

/** Identical server/client markup; the head bootstrap selects the visible language. */
export function LocaleText({ text }: { text: (lang: Lang) => string }) {
  return (
    <span className="m3e-locale-text">
      {LANGS.map(({ key }) => <span key={key} data-text-lang={key}>{text(key)}</span>)}
    </span>
  );
}

export function UIText({ id }: { id: UIKey }) {
  return <LocaleText text={(lang) => t(id, lang)} />;
}
