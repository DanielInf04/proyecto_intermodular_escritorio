import { categoriesService } from "../services/categories.service.js";

export class CategoryStore {
  constructor() {
    this.items = [];
    this.loading = false;
    this.error = null;
    this.listeners = new Set();
  }

  /**
   * Carga todas las categorías
   */
  async load() {
    try {
      this.loading = true;
      this.error = null;

      const categories = await categoriesService.list();

      this.items = categories ?? [];
      this.notify();

      return this.items;
    } catch (err) {
      console.error("Error cargando categorías:", err);
      this.error = err;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Devuelve todas las categorías (carga si no existen)
   */
  async getAll() {
    if (!this.items.length) {
      await this.load();
    }
    return this.items;
  }

  /**
   * Devuelve categoría por ID (desde memoria)
   */
  getById(id) {
    return this.items.find(c => Number(c.id) === Number(id)) || null;
  }

  /**
   * Suscripción para notificar cambios
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.items));
  }

  /**
   * Refresca forzando recarga
   */
  async refresh() {
    return this.load();
  }
}

export const categoryStore = new CategoryStore();