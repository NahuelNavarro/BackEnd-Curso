import { request, response } from "express";
import { productModel } from "../dao/models/products.js";
import { isValidObjectId } from "mongoose";
import { productService } from "../repositories/product.service.js";



// Obtener lista de productos con paginación, filtrado y ordenamiento
export const getProducts = async (req = request, res = response) => {
    try {
        // Parámetros de consulta
        let { limit = 10, page = 1, query, sort } = req.query;
        limit = Number(limit);
        page = Number(page);

        // Filtros de búsqueda
        const filter = {};
        if (query) {
            // Aquí podrías implementar la lógica para filtrar por categoría o disponibilidad
            filter.category = query; // Suponiendo que la categoría está en el campo 'category'
        }

        // Ordenamiento
        const sortOptions = {};
        if (sort) {
            sortOptions.price = sort === "asc" ? 1 : sort === "desc" ? -1 : 0;
        }

        // Consulta para contar total de documentos
        const total = await productService.countDocuments(filter);

        // Consulta para obtener productos con paginación y ordenamiento
        const skip = (page - 1) * limit;
        const productos = await productModel.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortOptions);

            console.log(productos)
        // Construcción de objeto de respuesta
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null;

        return res.json({
            status: "success",
            payload: productos,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });

    } catch (error) {
        console.error('Error en getProducts:', error);
        return res.status(500).json({ msg: 'Ocurrió un error, contacta al administrador.' });
    }
} //me falta uno

// Obtener un producto por su ID
export const getProductsById = async (req = request, res = response) => {
    try {
        const { pid } = req.params;

        // Validar si pid es un ID de MongoDB válido
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        const producto = await productService.getProductById(pid);
        
        if (!producto)
            return res.status(404).json({ msg: `El producto con ID ${pid} no existe.` });
        return res.json({ producto });

    } catch (error) {
        console.error('Error en getProductsById:', error);
        return res.status(500).json({ msg: 'Ocurrió un error, contacta al administrador.' });
    }
} //OK

// Añadir un nuevo producto
export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, thumbnail, code, stock, category, status } = req.body;

        // Validación de los campos requeridos
        if (!title || !description || !price || !stock || !category || !code) {
            return res.status(400).json({ msg: 'Los campos title, description, price, stock, category y code son obligatorios.' });
        }

        // Asegurarse de que la sesión tiene un usuario autenticado
       if (!req.session.usuario || !req.session.usuario.email) {
            return res.status(401).json({ msg: "Usuario no autenticado" });
        }

        // Extraer el email del usuario autenticado
        const userEmail = req.session.usuario.email.toString(); // Convertir a cadena si es necesario

        console.log('Usuario autenticado:', userEmail); // Debug para asegurar que el email está presente

        // Crear el producto con el owner asignado al correo del usuario
        const producto = await productService.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status,
            owner: userEmail // Pasar directamente el email como string
        });


        return res.status(201).json({ msg: 'Producto añadido correctamente.', producto });

    } catch (error) {
        console.error('Error en addProduct:', error);
        return res.status(500).json({ msg: 'Ocurrió un error, contacta al administrador.' });
    }
};

// Actualizar un producto por su ID
export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }

        // Utiliza el productService para actualizar el producto
        const producto = await productService.update(pid, req.body);
        if (!producto) {
            return res.status(404).json({ msg: `No se encontró el producto con el ID ${pid}.` });
        }

        return res.json({ msg: 'Producto actualizado.', producto });

    } catch (error) {
        console.error('Error en updateProduct:', error);
        return res.status(500).json({ msg: 'Ocurrió un error, contacta al administrador.' });
    }
} //OK

// Eliminar un producto por su ID
export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ msg: `El ID proporcionado no es válido.` });
        }
        const producto = await productService.delete(pid);
        if (!producto)
            return res.status(404).json({ msg: `No se encontró el producto con el ID ${pid}.` });

        return res.json({ msg: 'Producto eliminado.', producto });

    } catch (error) {
        console.error('Error en deleteProduct:', error);
        return res.status(500).json({ msg: 'Ocurrió un error, contacta al administrador.' });
    }
} //OK
