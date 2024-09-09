import { usuarioModelo } from "./models/usuario.js";
import mongoose from "mongoose";

export class UsuarioMongoManager {

    async create(usuario) {
        let nuevoUsuario = await usuarioModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }
    

      async getBy(filtro = {}){
        return await usuarioModelo.findOne(filtro).lean()
    }


    async getAll() {
        const usuarios = await usuarioModelo.find()
        return usuarios;
    }

    async get() {
        return await usuarioModelo.find().populate("ordenes.orden").lean()
    }

    async update(id, usuario) {
        return await usuarioModelo.updateOne({ _id: id }, usuario)
    }

    async updatePremiun(uid) {
        // Cambiar solo el rol del usuario a 'premium'
        return await usuarioModelo.updateOne(
            { _id: uid }, 
            { $set: { rol: 'premium' } }  // Actualiza solo el campo 'rol' a 'premium'
        );
    }

    async findOne(id) {
        try {
            const usuario = await usuarioModelo.findOne({ carrito: id });
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

    async findById(id) {
        try {
            // Usar findById para buscar el usuario por su campo _id
            const usuario = await usuarioModelo.findById(id).lean();

            if (!usuario) {
                console.log('Usuario no encontrado');
                return null;
            }

            return usuario;
        } catch (error) {
            console.error('Error al buscar el usuario por ID:', error);
            throw error;
        }
    }

}