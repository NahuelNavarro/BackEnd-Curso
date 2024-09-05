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

describe("Products API", function () {
    this.timeout(10000);

    let productId; // Para almacenar el ID del producto creado

    before(async function () {
        // Opcional: Inicializar datos necesarios para las pruebas
    });


    beforeEach(async function () {
        await mongoose.connection.collection("productos").deleteMany({code:"..dfgmssssddddmy8"});
    });

    describe("GET /api/productos/", function () {
        it("debería traer todos los productos", async function () {
            const response = await requester.get("/api/productos/");
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array");
            expect(response.body.payload).to.have.lengthOf.above(0);
            expect(response.body.payload[0]).to.have.property("title");
            expect(response.body.payload[0]).to.have.property("price");
        });
    });

    describe("GET /api/productos/:pid", function () {
        it("debería traer un producto por ID", async function () {
        

            let productId = "66d90a1ae90028d46cea4c2c"; // Guardar el ID del producto creado

            const getResponse = await requester.get(`/api/productos/${productId}`);
            //console.log(getResponse.body.producto)
            expect(getResponse.body.producto.status).equal(true);
            expect(getResponse.body.producto).to.have.property("title");
            expect(getResponse.body.producto).to.have.property("price");
        });
    });

    describe("POST /api/productos/", function () {
        it("Crea un producto nuevo", async function () {
            let productoNuevo = {
                title: "Pddersdasda",
                description: "Mango caribeño",
                price: 600,
                code: "..dfgmssssddddmy8",
                stock: 10,
                category: "frutas",
                thumbnails: ["httpalsdaksjdalksj"]
            };
    
            const response = await requester
                .post("/api/productos/")
                .send(productoNuevo)
                //.expect(201); // Asegúrate de que la respuesta tiene el código de estado esperado
    
           // console.log(response.body.producto);
            expect(response.body.producto).to.have.property("title", productoNuevo.title);
            expect(response.body.producto).to.have.property("price", productoNuevo.price);
            // Añade más expectativas según la estructura de la respuesta esperada
        });
    });

});
