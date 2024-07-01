import { request, response } from "express";
import { cartModel } from "../dao/models/carts.js";
import { productModel } from "../dao/models/products.js";
import { isValidObjectId } from "mongoose";
import { cartManagerMongo } from "../dao/CartMongoManager.js";
import { ManagerMongo } from "../dao/ProductMongoManager.js";
import { UsuarioMongoManager } from "../dao/UsuarioMongoManager.js";
import mongoose from "mongoose";
import { ordenesModelo } from "../dao/models/ordenes.js";


const cartManager = new cartManagerMongo
const productManager = new ManagerMongo
const userManager = new UsuarioMongoManager


export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
        const carrito = await cartManager.getOneByPopulate(cid)
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
        let product = await productModel.findById(pid);

        let productoInCart = carrito.products.find(p => p.product._id.toString() === pid);
        if (productoInCart)
            productoInCart.quantity++;

        else {
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

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:"gmail",
    port: "587",
    auth:{
        user:"navarronahuelezequiel@gmail.com",
        pass: "weaisaorqlkoqwhm"
    }
});



export const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        // Obtener el carrito y poblar los productos
        const carrito = await cartModel.findById(cid).populate('products.product');
        
        // Validar la existencia del carrito
        if (!carrito) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Validar existencia y stock de los productos
        const productos = await productManager.getAll();

        for (const item of carrito.products) {
            const producto = productos.find(p => p._id.toString() === item.product._id.toString());

            if (!producto) {
                return res.status(404).json({ msg: `Producto con ID ${item.product._id} no encontrado` });
            }
            if (producto.stock < item.quantity) {
                return res.status(400).json({ msg: `No hay suficiente stock para el producto ${producto.title}` });
            }

            // Actualizar el stock del producto
            producto.stock -= item.quantity;
            // Guardar el producto actualizado en la base de datos
            await producto.save();
        }

        // Obtener el propietario del carrito
        const usuario = await userManager.findOne(carrito.usuario);
        const idUsuarioCart = await cartManager.getByOne(usuario.carrito)
        console.log(idUsuarioCart)

        // Validar la existencia del usuario
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Crear una nueva orden
        const nuevaOrden = {
            usuario: usuario._id,
            pedido: carrito.products.map(item => ({
                productId: item.product._id,
                descripcion: item.product.title,
                cantidad: item.quantity,
                precio: item.product.price
            })),
            total: carrito.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
            createdAt: new Date()
        };

        // Guardar la nueva orden en la base de datos
        const ordenCreada = await ordenesModelo.create(nuevaOrden);

        // Añadir la orden a la lista de órdenes del usuario
        usuario.ordenes.push(ordenCreada._id);
        await usuario.save();

        // Enviar correo electrónico
        const mailOptions = {
            from: 'Ecommerce',
            to: usuario.email,
            subject: 'Confirmación de compra',
            text: `Hola ${usuario.nombre},\n\nTu compra ha sido realizada con éxito. Aquí tienes los detalles de tu orden:\n\n${nuevaOrden.pedido.map(item => `Producto: ${item.descripcion}, Cantidad: ${item.cantidad}, Precio: ${item.precio}`).join('\n')}\n\nTotal: ${nuevaOrden.total}\n\nGracias por tu compra!`
        };

        await transporter.sendMail(mailOptions);

        // Respuesta exitosa
        return res.status(200).json({ msg: 'Compra realizada con éxito', orden: ordenCreada });

    } catch (error) {
        console.error('Error en purchaseCart:', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
};
