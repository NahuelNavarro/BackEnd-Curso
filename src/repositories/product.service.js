import {ManagerMongo} from "../dao/ProductMongoManager.js"

class ProductService{
    constructor(dao){
        this.dao=dao
    }

    
    async getProductById(pid){
        return await this.dao.getProduct(pid)
    }

    async getAllProducts(){
        return await this.dao.getAll()
    }

    async countDocuments(filter){
        return await this.dao.countDocs(filter)
    }

    async create({ title, description, price, thumbnail, code, stock, category, status }){
        return await this.dao.createProduct({ title, description, price, thumbnail, code, stock, category, status })
    }

    async update(pid, productData) {
        return await this.dao.updateProduct(pid, productData);
    }

    async delete(pid) {
        return await this.dao.deleteProduct(pid);
    }
   
    }


export const productService=new ProductService(new ManagerMongo())
