/*import { Category } from "../model/category.js";

export class CategoryStore {
    #categories = [];
    #loadingPromise = null;
    #listeners = new Set();

    subscribe(fn) {
        this.#listeners.add(fn);
        return () => this.#listeners.delete(fn);
    }

    #emit() {
        for (const fn of this.#listeners) fn(this.getSnapshot());
    }

    getSnapshot() {
        return [...this.#categories];
    }

    async getAll({ force = false } = {}) {
        // Si ya tengo datos y no fuerzas, devuelvo caché
        if (!force && this.#categories.length) return this.getSnapshot();

        // Deduplicación: si ya hay una carga en curso, espero esa
        if (!force && this.#loadingPromise) return this.#loadingPromise;

        this.#loadingPromise = (async () => {
            const raw = await window.api.categories.list();
            this.#categories = raw.map((c) => new Category(c.id, c.nombre));
            this.#emit();
            return this.getSnapshot();
        })().finally(() => {
            this.#loadingPromise = null;
        });

        return this.#loadingPromise;
    }

    // Si en algún punto creas/actualizas categorías, puedes refrescar:
    async refresh() {
        return this.getAll({ force: true });
    }

    // Opcional: helpers
    getById(id) {
        return this.#categories.find(c => c.id === id) ?? null;
    }
}

export const categoryStore = new CategoryStore();*/