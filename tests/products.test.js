import { dbConnection } from "../models/database/db.js";
import server from "../app.js";
import { jwt, api, getAllProducts } from "./helpers.js";


test.skip("products are returned as json", async () => {
    await api
        .get("/api/products")
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiVG9wb2lkZSIsImNvbXBhbnlJZCI6MzUsInJvbElkIjozLCJpYXQiOjE3MTA5ODA4NDgsImV4cCI6MTcxMTU4NTY0OH0.5u9sg-bxaIfw9YQ4Tr0U9Q4APnmo6X4UO6WxcPt-mOE")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test.skip("product by name are returned as json", async () => {
    await api
        .get("/api/products/search?name=Memoria+ram+ddr5")
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiVG9wb2lkZSIsImNvbXBhbnlJZCI6MzUsInJvbElkIjozLCJpYXQiOjE3MTA5ODA4NDgsImV4cCI6MTcxMTU4NTY0OH0.5u9sg-bxaIfw9YQ4Tr0U9Q4APnmo6X4UO6WxcPt-mOE")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test.skip("product searched is a RAM memory", async () => {
    const response = await api
        .get("/api/products/search?name=Memoria+ram+ddr5")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    const content = response.body[0].nombre;

    expect(content).toContain("Memoria RAM DDR5");
});

test.skip("a valid product can be added", async () => {
    const newProduct = {
        producto_id: 0,
        nombre: "Helado savory",
        precio: 25000,
        modelo: "Kingston Fury",
        proveedor_id: 16,
        stock: 10,
        descripcion: "RAM DDR4 8GB 5400Mhz",
        numero_serie: 19021
    };

    await api
        .post("/api/products")
        .set("Authorization", `Bearer ${jwt}`)
        .send(newProduct)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const response = await getAllProducts();

    const contents = response.body.products.map(product => product.nombre);
    expect(contents).toContain(newProduct.nombre);
});

test.skip("product without content can't be added", async () => {
    const newProduct = {
        producto_id: 0,
        nombre: "Helado savory",
        precio: 25000,
        modelo: "Kingston Fury",
        proveedor_id: 16,
        stock: 10,
        descripcion: "RAM DDR4 8GB 5400Mhz",
    };

    await api
        .post("/api/products")
        .set("Authorization", `Bearer ${jwt}`)
        .send(newProduct)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const response = await api
        .get("/api/products/")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body.products).toHaveLength(response.body.productsLength);
});

test.skip("a product can be deleted", async () => {
    const { response: firstResponse } = await getAllProducts();

    const productToDelete = 84;

    await api
        .delete(`/api/products/delete/${productToDelete}`)
        .set("Authorization", `Bearer ${jwt}`)
        .expect(204);

    const { response: secondResponse } = await getAllProducts();

    expect(secondResponse.body.products).toHaveLength(firstResponse.body.productsLength - 1);
});

test.skip("a product can be modified", async () => {
    const productToModified = 35;
    const modifiedProduct = {
        precio: 25000
    };

    await api
        .patch(`/api/products/update/${productToModified}`)
        .set("Authorization", `Bearer ${jwt}`)
        .send(modifiedProduct)
        .expect("Content-Type", /application\/json/)
        .expect(200);

    const { response } = await getAllProducts();

    expect(response.body.products[0].precio).toContain(`${modifiedProduct.precio}.00`);
});

test.skip("jwt test in products requests", async () => {
    const response = await api
        .get("/api/products")
        .expect(401)
        .expect("Content-Type", /application\/json/);

    expect(response.text).toContain("\"jwt must be provided\"");
});

afterAll(() => {
    dbConnection.end();
    server.close();
});