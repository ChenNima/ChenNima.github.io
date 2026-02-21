import { useEffect } from "react";

export function useShikiHighlight(
  ref: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!ref.current) return;
    const codeBlocks = ref.current.querySelectorAll("pre > code[class*='language-']");
    if (codeBlocks.length === 0) return;

    let cancelled = false;

    import("shiki/bundle/web").then(async ({ codeToHtml }) => {
      if (cancelled) return;

      for (const block of codeBlocks) {
        if (cancelled) return;
        const langMatch = block.className.match(/language-(\S+)/);
        if (!langMatch) continue;
        const lang = langMatch[1];
        const code = block.textContent || "";
        try {
          const html = await codeToHtml(code, {
            lang,
            theme: "github-dark",
          });
          if (cancelled) return;
          const pre = block.parentElement;
          if (pre && pre.tagName === "PRE") {
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            const newPre = tmp.firstElementChild as HTMLElement;
            if (newPre) {
              newPre.style.borderRadius = "8px";
              newPre.style.padding = "1.2em";
              pre.replaceWith(newPre);
            }
          }
        } catch {
          // Language not supported by shiki, leave as-is
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ref]);
}
