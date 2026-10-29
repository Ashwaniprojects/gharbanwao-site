let lenisRef = null;

export const setLenis = (l) => {
  lenisRef = l;
};

export function scrollToId(id, offset = -84) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Jump to the very top of the page. Plain window.scrollTo does not move Lenis's
// virtual scroll position, so under Lenis it leaves the page looking mid-scroll.
export function scrollToTop(smooth = false) {
  if (lenisRef) {
    lenisRef.scrollTo(0, { duration: smooth ? 1 : 0 });
  } else {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }
}
