import { request, response } from "express";
import { cartModel } from "../data/models/carts.js";
import { productModel } from "../data/models/products.js";
import { isValidObjectId } from "mongoose";

export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
        const carrito = await cartModel.findById(cid)
        if (carrito)
            return res.json({ carrito });
        return res.status(404).json({ msg: ` el carrito con ${cid} no existe` })
    

    } catch (error) {
        console.log('getCartById => ', error)
        return res.status(500).json({ msg: 'Hablar con el admin' })
    }
}//ok

export const createCart = async (req = request, res = response) => {
    try {
        const carrito = await cartModel.create({})
        return res.json({ msg: `carrito creado`, carrito })
    } catch (error) {
        console.log('createCart => ', error)
        return res.status(500).json({ msg: 'Hablar con el admin' })
    }
}//ok

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
    

        const carrito = await cartModel.findById(cid).populate('products.product');

        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });

        let productoInCart = carrito.products.find(p => p.product._id.toString() === pid);
        if (productoInCart) {
            productoInCart.quantity++;
        } else {
            const product = await productModel.findById(pid);
            if (!product)
                return res.status(404).json({ msg: `El producto con id ${pid} no existe` });

            carrito.products.push({ product, quantity: 1 });
        }

        await carrito.save();

        return res.json({ msg: `Carrito actualizado`, carrito });
        
    } catch (error) {
        console.log('addProductInCart => ', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
} //ok

export const deleteProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
    
        const carrito = await cartModel.findById(cid);

        if (!carrito) {
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        }

        const productoAEliminar = carrito.products.find(producto => producto.product._id.toString() === pid); 
        if (!productoAEliminar) {
            return res.status(404).json({ msg: `El producto con id ${pid} no existe en el carrito` });
        }

        carrito.products = carrito.products.filter(producto => producto.product._id.toString() !== pid);
        console.log(carrito.products)
        await carrito.save();
        

        return res.json({ msg: `Producto borrado`, carrito });

    } catch (error) {
        console.error('deleteProductInCart => ', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
}//ok

export const deleteAllItemsInCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
    
        const carrito = await cartModel.findById(cid);

        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });

        carrito.products = []; // Vaciar el array de productos del carrito
        await carrito.save();

        return res.json({ msg: `Todos los elementos del carrito han sido eliminados`, carrito });

    } catch (error) {
        console.log('deleteAllItemsInCart => ', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
}//ok

export const updateQuantityProductById = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
    

        // Buscar el carrito por su ID
        const carrito = await cartModel.findById(cid).populate("products.product");
        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });

        // Buscar el producto en el carrito por su ID
        const productIndex = carrito.products.findIndex(p => p.product._id.toString() === pid);
        if (productIndex !== -1) {
            // Si el producto está en el carrito, actualizar su cantidad
            carrito.products[productIndex].quantity = quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad especificada
            const product = await productModel.findById(pid);
            if (!product)
                return res.status(404).json({ msg: `El producto con id ${pid} no existe` });

            carrito.products.push({ product, quantity });
        }

        // Guardar los cambios en el carrito
        await carrito.save();

        return res.json({ msg: `Carrito actualizado`, carrito });

    } catch (error) {
        console.log('updateQuantityProductById => ', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
}//ok



