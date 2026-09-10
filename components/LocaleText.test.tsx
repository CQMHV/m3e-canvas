import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LANGS, t } from "../lib/i18n";
import { LocaleText, UIText } from "./LocaleText";

describe("pre-paint localized text", () => {
  it("includes each translation once in stable markup", () => {
    const html = renderToStaticMarkup(<UIText id="search" />);
    for (const { key } of LANGS) {
      expect(html).toContain(`data-text-lang="${key}">${t("search", key)}</span>`);
    }
  });

  it("escapes translations as text instead of interpreting markup", () => {
    const html = renderToStaticMarkup(<LocaleText text={() => "<script>test</script>"} />);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
