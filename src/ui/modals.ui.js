export const Modals = {
  show(id) {
    const el = document.getElementById(id);
    if (!el) return;
    bootstrap.Modal.getOrCreateInstance(el).show();
  },

  hide(id) {
    const el = document.getElementById(id);
    if (!el) return;
    bootstrap.Modal.getInstance(el)?.hide();
  }
};