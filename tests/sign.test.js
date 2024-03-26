import { dbConnection } from "../models/database/db.js";
import server from "../app.js";
import { api } from "./helpers.js";


test.skip("Users can sign up in application", async () => {
    const newUser = {
        nombre_usuario: "Papote_Malote",
        nombre: "Carlos",
        apellidos: "Valderrama",
        contraseña: "raviolesconqueso!",
        email: "carlosvalderrama@gmail.com",
        telefono: 56922178909
    };

    const response = await api
        .post("/api/register")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("message");
});

test.skip("User can sign in application", async () => {
    const userData = {
        username: "Papote_Malote",
        password: "raviolesconqueso!"
    };

    const response = await api
        .post("/api/login")
        .send(userData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("token");
});

test("User may fail to login", async () => {
    const userData = {
        username: "Papote_Malote",
        password: "raviolesconqueso"
    };

    const response = await api
        .post("/api/login")
        .send(userData)
        .expect(401)
        .expect("Content-Type", /application\/json/);

    expect(response.text).toContain("Invalid user or password");
});

afterAll(() => {
    dbConnection.end();
    server.close();
});