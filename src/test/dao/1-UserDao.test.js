import { UsuarioMongoManager } from "../../dao/UsuarioMongoManager.js";
import mongoose from "mongoose";
import Assert from 'assert';
import {describe,it} from "mocha"

const assert = Assert.strict

const connDB = async()=>{
    try {
        await mongoose.connect(
            "mongodb+srv://navarronahuelezequiel:opigabUdOF6Eg4UZ@cluster0.j2bap5k.mongodb.net/ecommerce",
            {
                dbName: "mongodb"
            }
        )
        console.log("DB conectada")
    } catch (error) {
        console.log(`Error al conectar a DB:${error}`)
    }
}   

await connDB()



describe("pruebas dao users", function() {
    this.timeout(5000); // Aumenta el timeout a 5000ms

    it("El dao con el metodo getAll retorna un array de usuarios", async function(){
        const usuariosManager = new UsuarioMongoManager();
        console.log("Fetching users...");
        let resultado = await usuariosManager.getAll();
        console.log("Resultado:", resultado);
        assert(Array.isArray(resultado), "El resultado no es un array");
    });
});