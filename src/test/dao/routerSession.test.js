import { UsuarioMongoManager } from "../../dao/UsuarioMongoManager.js";
import { afterEach, describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";

const requester = supertest("http://localhost:8080");

const connDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://navarronahuelezequiel:opigabUdOF6Eg4UZ@cluster0.j2bap5k.mongodb.net/ecommerce",
            {
                dbName: "ecommerce"
            }
        );
        console.log("DB conectada");
    } catch (error) {
        console.log(`Error al conectar a DB: ${error}`);
    }
};

await connDB();

describe("prueba", function () {
    this.timeout(10000);

    // Limpiar el usuario antes de cada prueba
    beforeEach(async function () {
        await mongoose.connection.collection("usuarios").deleteMany({ email: "test@gmail.com" });
    });

    describe("Session router", function () {

        it("La ruta api/session/registro con su metodo post, registra un usuario", async function () {
            let mockerUser = { nombre: "test", email: "test@gmail.com", password: "test" };
            let response = await requester.post("/api/session/registro").send(mockerUser);

            // Confirmar que la respuesta tiene el status code correcto
            expect(response.status).to.equal(201);

            // Confirmar que la respuesta tiene el cuerpo adecuado
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.property("payload").that.equals("registro exitoso");

            // Confirmar que el usuario registrado está en el cuerpo de la respuesta
            expect(response.body).to.have.property("usuario");
            expect(response.body.usuario).to.have.property("nombre").that.equals(mockerUser.nombre);
            expect(response.body.usuario).to.have.property("email").that.equals(mockerUser.email);

            // Mostrar el payload para confirmar
            console.log("Registro exitoso:", response.body.payload);
        });

        it("Debería iniciar sesión con credenciales válidas", async function () {
            // Primero, registra el usuario
            let mockerUser = {  email: "test@gmail.com", password: "test" };
            await requester.post("/api/session/login").send(mockerUser);

            // Ahora, intenta iniciar sesión con las mismas credenciales
            let response = await requester.post("/api/session/login").send({ email: "test@gmail.com", password: "test" });

           // expect(response.request._data).that.equals(mockerUser);

            // Mostrar el mensaje para confirmar
            //console.log("Inicio de sesión exitoso:", response);
        });

   

      

    });
});
