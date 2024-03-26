import supertest from "supertest";
import { app } from "../app.js";

export const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoiVG9wb2lkZSIsImNvbXBhbnlJZCI6MzcsInJvbElkIjo0LCJpYXQiOjE3MTE0MDg0ODgsImV4cCI6MTcxMjAxMzI4OH0.ZM7z9CgDPknUmTso4TOJwC89qBOFE72GFbp00TX1iwA";

export const api = supertest(app);

export const getAllProducts = async () => {
    const response = await api
        .get("/api/products")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    return {
        response
    };

};