import { dbConnection } from "../models/database/db.js";
import server from "../app.js";
import { api, jwt } from "./helpers.js";


test.skip("User is able to create a company", async () => {
    const newCompany = {
        nombre: "La Mechada de Ramón",
        email: "mechadaramon@gmail.com",
        telefono: 56957890052
    };

    const response = await api
        .post("/api/companies/create")
        .set("Authorization", `Bearer ${jwt}`)
        .send(newCompany)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    expect(response.text).toContain("Your company was created successfull");

});

test.skip("Check if company already exists", async () => {
    const newCompany = {
        nombre: "Pizza House",
        email: "mechadaramon@gmail.com",
        telefono: 56957890052
    };

    const response = await api
        .post("/api/companies/create")
        .set("Authorization", `Bearer ${jwt}`)
        .send(newCompany)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    expect(response.text).toContain("A company with this name, e-mail address, or telephone number already exists.");

});

test.skip("CEO user can delete his company", async () => {
    const response = await api
        .delete("/api/companies/delete")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(200);

    expect(response.text).toContain("Company deleted");
});

test.skip("Only CEO can delete his company", async () => {
    const response = await api
        .delete("/api/companies/delete")
        .set("Authorization", `Bearer ${jwt}`)
        .expect(401);

    expect(response.text).toContain("Unauthorized. Insufficient Permission");
});

test.skip("CEO user can modify his company", async () => {
    const modifiedCompany = {
        nombre: "Pepperoni House"
    };

    const response = await api
        .patch("/api/companies/update")
        .set("Authorization", `Bearer ${jwt}`)
        .send(modifiedCompany)
        .expect("Content-Type", /application\/json/)
        .expect(200);

    expect(response.text).toContain("Company updated");
});

test.skip("Only CEO can modify his company", async () => {
    const modifiedCompany = {
        nombre: "Cheese House"
    };

    const response = await api
        .patch("/api/companies/update")
        .set("Authorization", `Bearer ${jwt}`)
        .send(modifiedCompany)
        .expect("Content-Type", /application\/json/)
        .expect(401);

    expect(response.text).toContain("Unauthorized. Insufficient Permission");
});


afterAll(() => {
    dbConnection.end();
    server.close();
});