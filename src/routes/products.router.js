import { Router } from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct} from "../controllers/products.js";
import { auth } from "../middleware/auth.js";
export const router = Router();
//import ProductManager from '../dao/ProductManager.js';

router.get('/', getProducts);

router.get('/:pid', getProductsById)

router.post('/',auth, addProduct);

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)