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
                dbName: "ecommerce"
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

afterEach(async function () {
    await mongoose.connection.collection("users").deleteMany({email:"test@gmail.com1"})
})    

    it("El dao con el metodo getAll retorna un array de usuarios", async function () {
        const usuariosManager = new UsuarioMongoManager();
       // console.log("Fetching users...");
        let resultado = await usuariosManager.getAll();
       // console.log("Resultado:", resultado);
        assert.equal(Array.isArray(resultado), true);
        if(Array.isArray(resultado) && resultado.length>0){
            assert.ok(resultado[0]._id) //es como que comprueba que exista en mi base de datos el .id o el .email
            assert.ok(resultado[0].email)
            //assert.ok(resultado[0].color)
            assert.equal(Object.keys(resultado[0].toJSON()).includes("_id"), true)
        }
    });


    it("El dao con su metodo create, crea un usuario", async function () {
        const usuariosManager = new UsuarioMongoManager();
        let mockerUser = { nombre:"test1",email:"test@gmail.com1", password:"test1"}
        let resultado =  await usuariosManager.create(mockerUser)
        console.log(resultado._id)

        //assert.ok(resultado)
    })
});