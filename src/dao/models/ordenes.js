import mongoose from 'mongoose';

const OrdeneShema = new mongoose.Schema({
  nrOrden: String,
  fecha: Date,
    usuario: {
      type: mongoose.Types.ObjectId, ref: "usuarios"
    },
    pedido: {
      type: [
        {
          id: Number, descripcion: String, cantidad: Number
        }
      ]
    },
    total: Number
},
{
  timestamps: true
});

export const ordenesModelo = mongoose.model('orden', OrdeneShema);