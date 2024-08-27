import { Router } from "express";
import { productModel } from "../dao/models/products.js";
import { ManagerMongo } from "../dao/ProductMongoManager.js";
import { auth } from "../middleware/auth.js";
import { createCart, getCartById } from "../controllers/carts.js";
import { cartManagerMongo } from "../dao/CartMongoManager.js";
import jwt from "jsonwebtoken"
export const router = Router()

router.get('/', async (req, res) => {
    const productos = await productModel.find().lean();
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('products', { productos })
})

router.get('/realtimeproducts', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('realtimeproducts')
})

router.get('/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('chat')
})

const  productManager = new ManagerMongo()
const cartM = new cartManagerMongo()
router.get('/products',auth, async (req, res) => {
    let carrito = {
        _id:req.session.usuario.carrito
    }
        
    let {pagina} = req.query
    if(!pagina) pagina = 1

    let {docs:productos,totalPages,hasPrevPage,hasNextPage,prevPage,nextPage} = await productManager.getAllPaginate(pagina)
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('products',{productos,totalPages,hasPrevPage,hasNextPage,prevPage,nextPage,usuario:req.session.usuario,carrito
    })
})

router.get('/login',(req , res)=>{
 
    let {error} = req.query
    res.status(200).render('login', {error})
})

router.get('/registro',(req , res)=>{
    res.status(200).render('register')
})

router.get('/profile', auth, (req , res)=>{
    res.status(200).render('profile',{
        usuario:req.session.usuario
    })
})

router.get("/carrito/:cid", async (req, res) => {
    let { cid } = req.params;
   

    try {
        let carrito = await cartM.getOneByPopulate(cid); // Asumiendo que esto devuelve el carrito correctamente
        console.log(carrito); // Verifica la estructura de carrito en la consola

        res.render('carrito', { carrito }); // Pasar el objeto carrito a la plantilla

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).send("Error al obtener el carrito");
    }
});

router.get('/recovermail',(req , res)=>{
    res.status(200).render('recovermail')
})


router.get('/recover', (req, res) => {
    const PRIVATE_KEY = "CODERKEY"; // Asegúrate de usar la clave privada correcta
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Token no proporcionado');
    }

    try {
        // Verifica el token usando la clave privada
        const decoded = jwt.verify(token, PRIVATE_KEY);
        console.log("Token decoded successfully:", decoded); // Verifica el contenido del token

        // Renderiza la plantilla con el email extraído del token
        res.render('restablecercontraseña', { email: decoded.user.email });
        console.log("Email enviado a la plantilla:", decoded.user.email);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("Token expirado en:", error.expiredAt); // Verifica cuándo expiró el token
            return res.status(403).send('El token ha expirado. Por favor, solicita uno nuevo.');
        }
        console.error("Token inválido o error durante la verificación:", error); // Detalla el error
        return res.status(403).send('Token inválido o expirado');
    }
});
