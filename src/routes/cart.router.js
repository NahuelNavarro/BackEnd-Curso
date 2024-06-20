import { Router } from "express";
import { addProductInCart, createCart, getCartById, deleteProductInCart, deleteAllItemsInCart,updateQuantityProductById} from "../controllers/carts.js";

export const router = Router();

router.post('/', createCart);

router.get('/:cid', getCartById);

router.post('/:cid/product/:pid', addProductInCart);

router.delete('/:cid/products/:pid', deleteProductInCart)

router.delete('/:cid', deleteAllItemsInCart ) //ok

router.put('/:cid/products/:pid', updateQuantityProductById ) //ok




