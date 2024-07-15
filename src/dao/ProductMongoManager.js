import { productModel } from "./models/products.js";

export class ManagerMongo {

    async getAll() {
        return await productModel.find()
    }

    async getByID(filter) {
        return await productModel.find(filter)
    }

    async getAllPaginate(page = 1){
        return await 
        productModel.paginate({},{limit:10, page, lean:true})
    }

    async getProduct(pid) {
        return await productModel.findById(pid)
    }

    async countDocs(filter) {
        return await productModel.countDocuments(filter)
    }

    async createProduct({ title, description, price, thumbnail, code, stock, category, status }) {
        return await productModel.create({ title, description, price, thumbnail, code, stock, category, status })
    }

    async updateProduct(pid, productData) {
        return await productModel.findByIdAndUpdate(pid, productData, { new: true });
    }
    
    async deleteProduct(pid) {
        return await productModel.findOneAndDelete({ _id: pid });
    }
    
}