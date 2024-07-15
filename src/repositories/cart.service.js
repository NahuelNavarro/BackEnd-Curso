import {cartManagerMongo} from "../dao/CartMongoManager.js"

class CartService{
    constructor(dao){
        this.dao=dao
    }

    async getCarts(){
        return await this.dao.get()
    }

    async getCartById(id){
        return await this.dao.getByOne(id)
    }

    async getCartByIdPopulate(id){
        return await this.dao.getOneByPopulate(id)
    }

    async createCart(){
        return await this.dao.create()
    }
}

export const cartService=new CartService(new cartManagerMongo())
