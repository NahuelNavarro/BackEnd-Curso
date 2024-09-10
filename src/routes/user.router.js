import { Router } from "express";
import { recoverUser, procesarRestablecimientoContraseña,getUsers,findUserById, registrarUsuario,cambiaPremium} from "../controllers/usuarios.js";
export const router = Router();
//import ProductManager from '../dao/ProductManager.js';


router.get('/email/:email', recoverUser);
router.post('/restablecerConstrasena', procesarRestablecimientoContraseña);
router.get('/allUsers',getUsers)
router.get('/findUsers', findUserById)
router.get('/registrarUsuario',registrarUsuario)
router.post('/premiun/:uid',cambiaPremium)
router.post('/premiun/:uid/documents',cambiaPremium)