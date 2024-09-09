import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    rol: { type: String, default: "user" },
    password: { type: String, required: true },
    carrito: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    ordenes: {
        type:[
          {
            orden:{
              type:mongoose.Types.ObjectId, ref:'ordenes'
            }
          }
        ]
    },
    // Nueva propiedad 'documents', un arreglo de objetos con 'name' y 'reference'
    documents: {
        type: [
          {
            name: { type: String, required: true },
            reference: { type: String, required: true }
          }
        ],
        default: []  // Default como arreglo vacío
    },
    // Nueva propiedad 'last_connection' de tipo Date
    last_connection: { 
        type: Date 
    }
}, 
{
    timestamps: true  // Para incluir createdAt y updatedAt
});

// Exportar el modelo
export const usuarioModelo = mongoose.model('Usuarios', userSchema);