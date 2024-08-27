import { request, response } from "express";
import { UsuarioMongoManager } from "../dao/UsuarioMongoManager.js";
import { enviarMail, generaHash, generateToken, authToken, compararHash } from "../utils.js";

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

export const findUserById = async (req = request, res = response) => {
    const { id } = req.body;
    
    try {
        // Verifica que el ID sea válido si estás usando MongoDB u otra base de datos con IDs específicos
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        let usuario = await usuariosService.findById(id); // Obteniendo el usuario
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        console.log("Usuario obtenido:", usuario); // Verifica que el usuario fue obtenido correctamente
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ usuario }); // Retorna el usuario en la respuesta
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: "Error al obtener el usuario" });
    }
};

export const getUsers = async (req = request, res = response) => {
    try {
        let usuarios = await usuariosService.getAll(); // Obteniendo los usuarios
        console.log("Usuarios obtenidos:", usuarios); // Verifica que los usuarios fueron obtenidos correctamente
        
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ error: "No se encontraron usuarios" });
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ usuarios }); // Retorna los usuarios en la respuesta
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

export const recoverUser = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: "El parámetro 'email' es obligatorio" });
    }

    try {
        const usuario = await usuariosManager.getBy({ email });
        
        console.log(usuario)
        if (usuario) {
            // Generar el token JWT
            const token = generateToken({ email: usuario.email });

            // Crear el enlace que incluye el token
            const link = `http://localhost:8080/recover?token=${token}`;

            // Configurar el asunto y el cuerpo del correo
            const asunto = "Restablecer contraseña";
            const mensajeHTML = `
                <h1>Restablecer tu contraseña</h1>
                <p>Hola, ${usuario.nombre || 'Usuario'}. Haz clic en el enlace de abajo para restablecer tu contraseña:</p>
                <a href="${link}">Restablecer contraseña</a>
                <p>Si no solicitaste este correo, puedes ignorarlo.</p>
            `;

            // Envía el correo con el asunto y el cuerpo HTML
            await enviarMail(usuario.email, asunto, mensajeHTML);

            // Devuelve una respuesta indicando que el correo fue enviado
            return res.status(200).json({ message: 'Correo enviado con éxito', user: usuario });
        } else {
            return res.status(404).json({ error: `No se encontró un usuario con el email ${email}` });
        }
    } catch (error) {
        console.error('Error al recuperar el usuario:', error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};



export const procesarRestablecimientoContraseña = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if(newPassword.length <= 5) {
        return res.status(400).json({ error: "Debe contener más de 4 caracteres" });
    }

    try {
        const usuario = await usuariosService.getBy({ email });

        if (!usuario) {
            return res.status(404).json({ error: `No se encontró un usuario con el email ${email}` });
        }

        // Verificar si la nueva contraseña es la misma que la actual
        const isSamePassword = compararHash(newPassword, usuario.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "La contraseña no debe ser igual a la anterior, elija otra" });
        }

        // Generar el nuevo hash de la contraseña
        const hashedPassword = generaHash(newPassword);

        // Actualizar la contraseña del usuario
        usuario.password = hashedPassword;
        await usuariosManager.update(usuario._id, usuario);

        return res.status(200).json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};