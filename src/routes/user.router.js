import { Router } from "express";
import { recoverUser, procesarRestablecimientoContraseña,getUsers,findUserById, registrarUsuario,cambiaPremium, subirArchivos} from "../controllers/usuarios.js";
import { upload } from "../middleware/middlewareMulter.js";
export const router = Router();
//import ProductManager from '../dao/ProductManager.js';


router.get('/email/:email', recoverUser);
router.post('/restablecerConstrasena', procesarRestablecimientoContraseña);
router.get('/allUsers',getUsers)
router.get('/findUsers', findUserById)
router.get('/registrarUsuario',registrarUsuario)
router.post('/premiun/:uid',cambiaPremium)
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 5 },
    { name: 'document', maxCount: 10 }
  ]), subirArchivos);