import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { LANGS } from "./i18n";
import { initialLanguage } from "./initial-language";
import { LANGUAGE_BOOTSTRAP } from "./language-bootstrap";

function bootstrap(language: string, readUi: () => string | null) {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let mutation: (records: { addedNodes: unknown[] }[]) => void = () => {};
  let ready = () => {};
  const document = {
    documentElement: { lang: "ja" },
    addEventListener: vi.fn((_event: string, callback: () => void) => { ready = callback; }),
  };
  class Observer {
    constructor(callback: typeof mutation) { mutation = callback; }
    observe = observe;
    disconnect = disconnect;
  }
  runInNewContext(LANGUAGE_BOOTSTRAP, {
    document,
    navigator: { language },
    get localStorage() { return { getItem: readUi }; },
    MutationObserver: Observer,
  });
  return { document, observe, disconnect, mutate: (nodes: unknown[]) => mutation([{ addedNodes: nodes }]), ready: () => ready() };
}

describe("pre-paint language bootstrap", () => {
  const settings = [null, "{", "null", "{}", "[]", "42", '{"lang":"fr"}', ...LANGS.map(({ key }) => JSON.stringify({ lang: key }))];
  it.each(["ja-JP", "en-US", "zh-CN", "ZH-TW", "ko-KR", "fr-FR", ""])(
    "agrees with React initialization for browser %s", (language) => {
      for (const stored of settings) {
        const { document } = bootstrap(language, () => stored);
        expect(document.documentElement.lang).toBe(initialLanguage(() => stored, language));
      }
    },
  );

  it("uses the browser language when reading localStorage throws", () => {
    const { document } = bootstrap("zh-CN", () => { throw new Error("Blocked"); });
    expect(document.documentElement.lang).toBe("zh");
  });

  it.each(["placeholder", "title", "aria-label"])("localizes a parsed %s and stops observing after HTML parsing", (attribute) => {
    const result = bootstrap("zh-CN", () => null);
    const setAttribute = vi.fn();
    result.mutate([{
      nodeType: 1,
      hasAttribute: (name: string) => name === `data-ui-${attribute}`,
      getAttribute: () => JSON.stringify({ ja: "検索", en: "Search", zh: "搜索", ko: "검색" }),
      setAttribute,
      querySelectorAll: () => [],
    }]);
    expect(setAttribute).toHaveBeenCalledExactlyOnceWith(attribute, "搜索");
    expect(result.observe).toHaveBeenCalledWith(result.document.documentElement, { childList: true, subtree: true });
    result.ready();
    expect(result.disconnect).toHaveBeenCalledOnce();
  });
});
