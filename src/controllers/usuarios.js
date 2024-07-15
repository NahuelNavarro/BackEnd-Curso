import { request, response } from "express";
import { UsuarioMongoManager } from "../dao/UsuarioMongoManager.js";
import { generaHash } from "../utils.js";

const usuariosManager = new UsuarioMongoManager();
const usuariosService = new UsuarioMongoManager()

// Obtener lista de productos con paginación, filtrado y ordenamiento
export const registrarUsuario = async (req = request, res = response) => {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Complete nombre, mail y password" });
    }

    if (!email.trim()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "El correo electrónico no puede estar vacío" });
    }

    try {
        // Verificar si ya existe un usuario con el mismo correo electrónico
        let existe = await usuariosManager.getBy({ email });
        console.log(existe)
        console.log(email)
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un usuario con el email ${email}` });
        }

        // Generar el hash de la contraseña
        password = generaHash(password);

        // Crear un nuevo carrito
        const nuevoCarrito = await cartModel.create({ products: [] });

        // Crear un nuevo usuario
        let nuevoUsuario = await usuariosManager.create({ nombre, email, password, carrito: nuevoCarrito._id });

        // Actualizar el carrito para asociarlo al nuevo usuario
        await cartModel.findByIdAndUpdate(nuevoCarrito._id, { $set: { user: nuevoUsuario._id } });

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ mensaje: `Registro correcto`, usuario: nuevoUsuario });

    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            { error: `Error inesperado detalle: ${error.message}` });
    }
}

export const loginUsuario = async (req = request, res = response) => {
    let { email, password, web } = req.body

    if (!email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Complete email y password" });
    }

    let usuario = await usuariosManager.getBy({ email, password: generaHash(password) })

    if (!usuario) {

        if (web) {
            return res.redirect(`/login?error=credenciales invalidas`)

        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: "Credenciales invalidas" })
        }
    }

    usuario = { ...usuario }
    delete usuario.password
    req.session.usuario = usuario

    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <script>
            alert("Login correcto");
            window.location.href = "/products";
        </script>
    `);
    //return res.status(200).json({ payload: " login correcto", usuario })
}

export const logOut = async (req = request, res = response) => {
    req.session.destroy(e => {
        if (e) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor -Intente mas tarde`,
                    detalle: `${error.message}`
                }
            )
        }
    })
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "Logout existoso" })
}

export const error = async (req = request, res = response) => {

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "error" })
}

export const getUsers = async (req = request, res = response) => {
let usuarios= await usuariosService.get()
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "error" })
}



