import mongoose, { Schema, model } from "mongoose";

export const  usuarioModelo = mongoose.model('usuarios', new mongoose.Schema({
    nombre: {
        type: String,
        required: true // El nombre es obligatorio
    },
    email: {
        type: String
    },
    rol:{
        type: String, default:"user"
    },
    password: {
        type: String,
        required: true // La contraseña es obligatoria
    },
    carrito:{
        type: mongoose.Types.ObjectId, ref:"Cart"
    }
},{timestamps: true, strict:false}))