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

describe("Carts API", function () {
    this.timeout(10000);

    let cartId; // Para almacenar el ID del carrito creado
    let productId; // Para almacenar el ID del producto creado

    before(async function () {
        // Opcional: Inicializar datos necesarios para las pruebas
    });

    beforeEach(async function () {
        await mongoose.connection.collection("productos").deleteMany({code:"apple123"});

    });

    describe("POST /api/carts/", function () {
        it("debería crear un nuevo carrito", async function () {
            const response = await requester.post("/api/carts/");
           // console.log(response._body)
            expect(response._body.msg).to.equal("carrito creado");
            expect(response._body.carrito).to.have.property("_id");
            cartId = response._body.carrito._id; // Guardar el ID del carrito creado
        });
    });

    describe("GET /api/carts/:cid", function () {
        it("debería traer un carrito por ID", async function () {
            const response = await requester.get(`/api/carts/${cartId}`);
            //console.log(response.statusCode)
            expect(response.res.statusCode).to.equal(200);
            expect(response.error).to.equal(false);
            expect(response._body.carrito).to.have.property("_id");
            expect(response._body.carrito).to.have.property("products").that.is.an("array");
        });
    });

    describe("POST /api/carts/:cid/product/:pid", function () {
        it("debería añadir un producto al carrito", async function () {
            const newProduct = {
                title: "Manzana",
                description: "Manzana roja",
                price: 200,
                code: "apple123",
                stock: 20,
                category: "frutas",
                thumbnails: ["http://example.com/apple.jpg"]
            };

            const productResponse = await requester
                .post("/api/productos/")
                .send(newProduct);


            productId = productResponse._body.producto._id; // Guardar el ID del producto creado
            //console.log(productId)


           const cartResponse = await requester
                .post(`/api/carts/${cartId}/product/${productId}`);
            //console.log(cartResponse)
              expect(cartResponse._body.msg).to.equal("Carrito actualizado");
              expect(cartResponse._body.carrito).to.have.property("products").that.is.an("array").with.lengthOf(1);
        });
    });

  
});