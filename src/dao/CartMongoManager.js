import { cartModel } from "../data/models/carts.js";
import { productModel } from "../data/models/products.js";

export class cartManagerMongo {

    async getByOne() {
        return await cartModel.findOne().populate("products.product")
    }

    async create(){
        let carrito = await cartModel.create({ products: [] });
        return carrito.toJSON();
    }

    async getOneByPopulate(cid) {
        try {
            // Busca un carrito por su id (cid) y popula los productos relacionados
            const carrito = await cartModel.findById(cid).populate("products.product").lean()
            return carrito
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            throw error;
        }
    }
}

