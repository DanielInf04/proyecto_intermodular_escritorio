export class Product {

    #id
    #nombre
    #marca
    #precio
    #stock
    #descripcion
    #imagen
    #subCategoriaId

    constructor(id, nombre, marca, precio, stock, descripcion, imagen, subCategoriaId) {
        this.#id = id;
        this.#nombre = nombre;
        this.#marca = marca;
        this.#precio = precio;
        this.#stock = stock;
        this.#descripcion = descripcion;
        this.#imagen = imagen;
        this.#subCategoriaId = subCategoriaId;
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }

    get marca() {
        return this.#marca;
    }

    get precio() {
        return this.#precio;
    }

    get stock() {
        return this.#stock;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get imagen() {
        return this.#imagen;
    }

    get subCategoriaId() {
        return this.#subCategoriaId;
    }

    set id(value) {
        this.#id = value;
    }

    set nombre(value) {
        this.#nombre = value;
    }

    set marca(value) {
        this.#marca = value;
    }

    set precio(value) {
        this.#precio = value;
    }

    set stock(value) {
        this.#stock = value;
    }

    set descripcion(value) {
        this.#descripcion = value;
    }

    set imagen(value) {
        this.#imagen = value;
    }

    set subCategoriaId(value) {
        this.#subCategoriaId = value;
    }

}