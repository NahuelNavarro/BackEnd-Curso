import mongoose from 'mongoose';

const OrdeneShema = new mongoose.Schema({
  nrOrden: String,
  fecha: Date,
  usuario: {
    type: mongoose.Types.ObjectId, ref: "usuarios"
  },
  pedido: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products'
      },
      descripcion: String,
      cantidad: Number,
      precio: Number
    }
  ],
  total: Number
}, {
  timestamps: true
});
export const ordenesModelo = mongoose.model('orden', OrdeneShema);