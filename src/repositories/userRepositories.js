import { UserDao } from "../dao/index.js";

export const create = async (usuario){
    let nuevoUsuario = await UserDao.UsuarioMongoManager.
    return nuevoUsuario.toJSON()
}

async getBy(filtro = {}){
    return await usuarioModelo.findOne(filtro).lean()
}

async getAll() {
    console.log('Llamando a getAll()');
    const usuarios = await usuarioModelo.find()
    console.log('Usuarios encontrados:', usuarios);
    return usuarios;
}

async get() {
   return await usuarioModelo.find().populate("ordenes.orden").lean()
}

async update(id,usuario) {
    return await usuarioModelo.updateOne({_id:id},usuario)
}

 async findOne(id) {
    try {
        
        const usuario = await usuarioModelo.findOne({  id });
        if (!usuario) {
            console.log('Usuario no encontrado');
            return null;
        }

        return usuario;
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        throw error;
    }
}