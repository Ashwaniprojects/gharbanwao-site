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
