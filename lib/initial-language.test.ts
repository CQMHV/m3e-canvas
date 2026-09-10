import { describe, expect, it } from "vitest";
import { initialLanguage } from "./initial-language";
import { LANGS } from "./i18n";

describe("initialLanguage", () => {
  it("prefers every supported saved language over the browser", () => {
    for (const { key } of LANGS) {
      expect(initialLanguage(() => JSON.stringify({ lang: key }), "fr-FR")).toBe(key);
    }
  });

  it.each([["zh-CN", "zh"], ["ZH-TW", "zh"], ["ko-KR", "ko"], ["ja-JP", "ja"], ["en-US", "en"], ["fr-FR", "en"], ["", "en"]])(
    "resolves browser %s to %s", (browser, expected) => {
      expect(initialLanguage(() => null, browser)).toBe(expected);
    },
  );

  it.each(["{", "null", "{}", "[]", "42", '{"lang":"fr"}', '{"lang":null}'])(
    "falls back for invalid settings %s", (stored) => {
      expect(initialLanguage(() => stored, "zh-CN")).toBe("zh");
    },
  );

  it("falls back when access to storage throws", () => {
    expect(initialLanguage(() => { throw new Error("Blocked"); }, "ko-KR")).toBe("ko");
  });
});
