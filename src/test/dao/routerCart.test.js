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
        await mongoose.connection.collection("carts").deleteMany({});
        await mongoose.connection.collection("productos").deleteMany({});
    });

    describe("POST /api/carts/", function () {
        it("debería crear un nuevo carrito", async function () {
            const response = await requester.post("/api/carts/");
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("_id");
            cartId = response.body.payload._id; // Guardar el ID del carrito creado
        });
    });

    describe("GET /api/carts/:cid", function () {
        it("debería traer un carrito por ID", async function () {
            const response = await requester.get(`/api/carts/${cartId}`);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("_id", cartId);
            expect(response.body.payload).to.have.property("products").that.is.an("array");
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

            productId = productResponse.body.producto._id; // Guardar el ID del producto creado

            const cartResponse = await requester
                .post(`/api/carts/${cartId}/product/${productId}`);

            expect(cartResponse.body.status).to.equal("success");
            expect(cartResponse.body.payload).to.have.property("products").that.is.an("array").with.lengthOf(1);
            expect(cartResponse.body.payload.products[0]).to.have.property("product").that.equals(productId);
        });
    });

    describe("DELETE /api/carts/:cid/products/:pid", function () {
        it("debería eliminar un producto del carrito", async function () {
            const response = await requester
                .delete(`/api/carts/${cartId}/products/${productId}`);

            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("products").that.is.an("array").with.lengthOf(0);
        });
    });

    describe("DELETE /api/carts/:cid", function () {
        it("debería eliminar todos los productos del carrito", async function () {
            await requester.post(`/api/carts/${cartId}/product/${productId}`); // Añadir un producto al carrito

            const response = await requester
                .delete(`/api/carts/${cartId}`);

            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("products").that.is.an("array").with.lengthOf(0);
        });
    });

    describe("PUT /api/carts/:cid/products/:pid", function () {
        it("debería actualizar la cantidad de un producto en el carrito", async function () {
            const response = await requester
                .put(`/api/carts/${cartId}/products/${productId}`)
                .send({ quantity: 3 });

            expect(response.body.status).to.equal("success");
            expect(response.body.payload.products[0]).to.have.property("quantity", 3);
        });
    });

    describe("POST /api/carts/:cid/purchase", function () {
        it("debería procesar la compra del carrito", async function () {
            const response = await requester
                .post(`/api/carts/${cartId}/purchase`);

            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("purchaseDetails");
        });
    });
});