/**
 * 읽기 화면 공용 동작 — 이슈·스프린트 페이지가 함께 가져다 쓴다.
 * ← / → 로 이전·다음 글로 이동하고, 주소 복사 버튼은 라벨 스왑으로 피드백한다.
 */

/* ← / → — 이전·다음 호. 입력 요소에서는 무시한다 */
document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
  if (event.key === "ArrowLeft") {
    document.querySelector<HTMLAnchorElement>(".issue__nav-link:not(.issue__nav-link--next)")?.click();
  }
  if (event.key === "ArrowRight") {
    document.querySelector<HTMLAnchorElement>(".issue__nav-link--next")?.click();
  }
});

/* 주소 복사 — 라벨 스왑이 피드백이다. 토스트는 없다 */
const copyBtn = document.querySelector<HTMLButtonElement>("[data-copy-link]");
copyBtn?.addEventListener("click", async () => {
  copyBtn.disabled = true;
  copyBtn.setAttribute("aria-busy", "true");
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyBtn.dataset.state = "copied";
    window.setTimeout(() => {
      delete copyBtn.dataset.state;
    }, 2500);
  } catch {
    copyBtn.dataset.state = "error";
  } finally {
    copyBtn.disabled = false;
    copyBtn.removeAttribute("aria-busy");
  }
});
