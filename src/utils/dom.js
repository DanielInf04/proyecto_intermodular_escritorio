export const $ = (sel, root = document) => root.querySelector(sel);

export function scrollToSubcatTop() {
  $("#pane-subcategories .table-responsive")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}