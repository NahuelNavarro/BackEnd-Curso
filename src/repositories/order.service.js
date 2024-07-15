import {OrdenesManager} from "../dao/OrdenestMongoManager.js"

class OrderService{
    constructor(dao){
        this.dao=dao
    }

    async createOrder(){
        return await this.dao.create()
    }


}

export const orderService =new OrderService (new OrdenesManager())
