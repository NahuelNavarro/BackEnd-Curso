import { Schema, model } from "mongoose";
import  {productModel}  from "./products.js";


const nameCollection = 'Cart';

const CartSchema = new Schema({
    products: [
        {
            _id: false,
            product: {
                type: Schema.Types.ObjectId,
                ref: 'productos' // Referencia al modelo de Producto
            },
            quantity: {
                type: Number,
                required: [true, 'La cantidad del producto es obligatoria']
            }
        }
    ]
});

export const cartModel = model(nameCollection, CartSchema);



