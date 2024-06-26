import { cartModel } from "./models/carts.js";
import { productModel } from "./models/products.js";
import mongoose from "mongoose";

export class cartManagerMongo {

    async getByOne(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid }).populate("products.product").lean();
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            throw error;
        }
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

