import fs from 'fs'
import ProductManager from './ProductManager.js';


const products = new ProductManager()
const productos = products.getProducts()


class CartManager {
    path;
    carts;
    static idCart = 0;

    //constructor
    constructor() {
        this.path = './src/data/carts.json'
        this.carts = this.leerCart()
    }

    //metodos

    leerCart() {
        try {
            if (fs.existsSync(this.path))//corroboro si existe el archivo con existsSync
                return JSON.parse(fs.readFileSync(this.path, 'utf-8')); // leo el archivo con readFileSyn y lo parseo ya que es una cadena de textpo
            return [];
        } catch (error) {
            console.log(`el error es el sigueinte ${error}`)
        }
    }

    guardarCart() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts))//guardo con writeFileSync, this path indica la ruta y luego indico que quiero guardar o sobreescrbir
        } catch (error) {
            console.log(`el error es el siguiente ${error}`)
        }
    }

    asignarId() {
        let id = 1
        if (this.carts.length != 0) //verifico si la cantidad de elementos es distinto de cero, es decir mayor o igual a 1
            id = this.carts[this.carts.length - 1].id + 1;  //this.carts -1 => toma el ultimo elemento.id de mi carts y le suma 1 al id
        return id
    }

    createCart() {
        const newCart = {
            id: this.asignarId(),
            products: []
        }

        this.carts.push(newCart)
        this.guardarCart()

        return newCart
    }

    getCartById(id) {
        let isItemFound = this.carts.find(item => item.id == id);
        if (isItemFound) {
            return isItemFound.products
        }
    }

    addProductInCart(cid, pid) {

         let respuesta = `el carrido con id ${cid} no existe`
        const indexCart = this.carts.findIndex(item => item.id == cid) //busco el indice del id del carrito, sino existe me arroja -1


        if (indexCart !== -1) { //si lo encuentra, es decir si es diferente a -1 o no es -1 hago lo de abajo
            
            const productIsInCart = this.carts[indexCart].products.findIndex(item => item.id == pid) //busco dentro de carts.products, que el id coincida con pid segun el el carrito
            const c = new ProductManager();
            const producto = c.getProductsById(pid) //busco desde mi getProductsById que existe en ProductManager segun mi pid

            if (producto.status && productIsInCart == -1) { //si status es true pero no esta dentro de products agrego
                
                this.carts[indexCart].products.push({ id: pid, 'quantity': 1 }) //dentro de carts, con el indice (indexCart) agrego un objeto
                this.guardarCart()
                respuesta = `agregado correctamente`

            } else if (producto.status && productIsInCart !== -1) { //si status es true pero si esta el producto dentro del carts, a quantity le sumo 1
            
                ++this.carts[indexCart].products[productIsInCart].quantity //segun la posicicion de id de Cart y segun la posicicion de id products.quantity
                this.guardarCart()
                respuesta = `ya existe en products, se sumo 1 a quantity`

            } else {
                respuesta = `producto con id ${pid} no existe`;
            }
        }
        return respuesta;
    }

}

export default CartManager