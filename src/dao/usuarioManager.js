import { usuarioModelo } from "../data/models/usuario.js";

export class UsuarioManager {

    async create(usuario){
        let nuevoUsuario = await usuarioModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro = {}){
        return await usuarioModelo.findOne(filtro).lean()
    }

    
}