import {UsuarioMongoManager} from "../dao/UsuarioMongoManager.js"

class UserService{
    constructor(dao){
        this.dao=dao
    }

    async findUser(carritoId){
        return await this.dao.findOne(carritoId)
    }

    async getById({ email }) {
        return await this.dao.getBy({ email });
    }


    async createUser(usuario){
        return await this.dao.create(usuario)
    }

    async findByIdUser(id){
        return await this.dao.findById(id)
    }


    
  
}

export const userService =new UserService (new UsuarioMongoManager())
