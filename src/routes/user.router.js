import { Router } from "express";
import { recoverUser, procesarRestablecimientoContraseña,getUsers,findUserById} from "../controllers/usuarios.js";
export const router = Router();
//import ProductManager from '../dao/ProductManager.js';


router.get('/email/:email', recoverUser);
router.post('/restablecerConstrasena', procesarRestablecimientoContraseña);
router.get('/allUsers',getUsers)
router.get('/findUsers', findUserById)


