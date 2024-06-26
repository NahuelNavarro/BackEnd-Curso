
import { ordenesModelo } from "./models/ordenes.js";

export class OrdenesManager {

    async get (){
        return await ordenesModelo.find().populate("usuario").lean()
    }

    async create(orden){
        let nuevaOrden = await ordenesModelo.create(orden);
        return nuevaOrden.toJSON()
    }

 
}

