import { productModel } from "../data/models/products.js";

export class ManagerMongo {

    async getall() {
        return await productModel.find().lean()
    }

    async getAllPaginate(page = 1){
        return await 
        productModel.paginate({},{limit:10, page, lean:true})
    }
}