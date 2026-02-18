export class Subcategory {

    #id
    #nombre
    #imagenUrl
    #categoriaId

    constructor(id, nombre, imagenUrl, categoriaId) {
        this.#id = id;
        this.#nombre = nombre;
        this.#imagenUrl = imagenUrl;
        this.#categoriaId = categoriaId;
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get imagenUrl() {
        return this.#imagenUrl;
    }

    get categoriaId() {
        return this.#categoriaId;
    }

    set id(value) {
        this.#id = value;
    }

    set nombre(value) {
        this.#nombre = value;
    }

    set imagenUrl(value) {
        this.#imagenUrl = value;
    }

    set categoriaId(value) {
        this.#categoriaId = value;
    }

}