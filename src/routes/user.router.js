import { Router } from "express";
import { recoverUser, procesarRestablecimientoContraseña,getUsers,findUserById, registrarUsuario} from "../controllers/usuarios.js";
export const router = Router();
//import ProductManager from '../dao/ProductManager.js';


router.get('/email/:email', recoverUser);
router.post('/restablecerConstrasena', procesarRestablecimientoContraseña);
router.get('/allUsers',getUsers)
router.get('/findUsers', findUserById)
router.get('/registrarUsuario',registrarUsuario)



