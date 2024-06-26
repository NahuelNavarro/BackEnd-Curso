import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    rol: { type: String, required: false },
    password: { type: String, required: true },
    carrito: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    ordenes: {
        type:[
          {
            orden:{
              type:mongoose.Types.ObjectId,ref:'ordenes'
            }
          }
        ]
    },
  },
  
  {
    timestamps: true
  });

export const usuarioModelo = mongoose.model('Usuarios', userSchema);