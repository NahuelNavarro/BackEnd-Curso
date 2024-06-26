import { productModel } from "./models/products.js";

export class ManagerMongo {

    async getAll() {
        return await productModel.find()
    }

    async getAllPaginate(page = 1){
        return await 
        productModel.paginate({},{limit:10, page, lean:true})
    }
}