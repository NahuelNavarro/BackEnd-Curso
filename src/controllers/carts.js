import { request, response } from "express";
import { isValidObjectId } from "mongoose";
import { cartService } from "../repositories/cart.service.js";
import { productService } from "../repositories/product.service.js"
import { orderService } from "../repositories/order.service.js";
import { userService } from "../repositories/user.service.js";
import { enviarMail } from "../utils.js";
import mongoose from "mongoose";


export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        const carrito = await cartService.getCartByIdPopulate(cid)

        if (carrito)
            return res.json({ carrito });
        return res.status(404).json({ msg: ` el carrito con ${cid} no existe` })

    } catch (error) {
        console.log('getCartById => ', error)
        return res.status(500).json({ msg: 'Hablar con el admin' })
    }
} //OK

export const createCart = async (req = request, res = response) => {
    try {
        const carrito = await cartService.createCart({})
        return res.json({ msg: `carrito creado`, carrito })
    } catch (error) {
        console.log('createCart => ', error)
        return res.status(500).json({ msg: 'Hablar con el admin' })
    }
} //OK

export const addProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        const carrito = await cartService.getCartByIdPopulate(cid)

        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });
        let product = await productService.getProductById(pid)
        console.log(product)

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
} //OK

export const deleteProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        const carrito = await cartService.getCartByIdPopulate(cid);

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
} //OK

export const deleteAllItemsInCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        const carrito = await cartService.getCartByIdPopulate(cid);

        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });

        carrito.products = []; // Vaciar el array de productos del carrito
        await carrito.save();

        return res.json({ msg: `Todos los elementos del carrito han sido eliminados`, carrito });

    } catch (error) {
        console.log('deleteAllItemsInCart => ', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
} //OK

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
        const carrito = await cartService.getCartByIdPopulate(cid)

        if (!carrito)
            return res.status(404).json({ msg: `El carrito con id ${cid} no existe` });

        // Buscar el producto en el carrito por su ID
        const productIndex = carrito.products.findIndex(p => p.product._id.toString() === pid);

        if (productIndex !== -1) {
            // Si el producto está en el carrito, actualizar su cantidad
            carrito.products[productIndex].quantity = quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad especificada
            const product = await productService.getProductById(pid);
            
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
} //OK

export const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        // Convertir cid a ObjectId usando la palabra clave 'new'
        const carritoId = new mongoose.Types.ObjectId(cid);

        // Obtener el carrito y poblar los productos
        const carrito = await cartService.getCartByIdPopulate(carritoId)
        
        // Validar la existencia del carrito
        if (!carrito) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Validar existencia y stock de los productos
        const productos = await productService.getAllProducts()

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

        // Obtener el usuario propietario del carrito
        const usuario = await userService.findUser(carritoId);
        console.log(usuario)

        // Validar la existencia del usuario
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Crear una nueva orden
        const nuevaOrden = {
            nrOrden:Date.now(),
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
        const ordenCreada = await orderService.createOrder(nuevaOrden);
        console.log(ordenCreada)
        // Añadir la orden a la lista de órdenes del usuario
        usuario.ordenes.push(ordenCreada._id);
        await usuario.save();

        // await transporter.sendMail(mailOptions);
        await enviarMail(usuario.email, "Confirmacion de compra", `Hola ${usuario.nombre},\n\nTu compra ha sido realizada con éxito. Aquí tienes los detalles de tu orden:\n\n${nuevaOrden.pedido.map(item => `Producto: ${item.descripcion}, Cantidad: ${item.cantidad}, Precio: ${item.precio}`).join('\n')}\n\nTotal: ${nuevaOrden.total}\n\nGracias por tu compra!`)

        // Respuesta exitosa
        return res.status(200).json({ msg: 'Compra realizada con éxito', orden: ordenCreada });

    } catch (error) {
        console.error('Error en purchaseCart:', error);
        return res.status(500).json({ msg: 'Hablar con el admin' });
    }
} //OK