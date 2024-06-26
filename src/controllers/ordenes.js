import { request, response } from 'express';
import { OrdenesManager } from '../dao/OrdenestMongoManager.js';

const ordenesService =new OrdenesManager()

export const createOrder = async (req = request, res = response) => {
    let {uid,nid,pedido} = req.body

    let nuevaOrden = "nuevaOrden"
    res.setHeader('Content-type','application/json')
    return res.status(201).json({nuevaOrden})
        
};