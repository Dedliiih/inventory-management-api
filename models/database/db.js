import mysql from "mysql2/promise";

const CONFIG = {
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Razer2023",
    database: "stockappdb"
};

export const dbConnection = await mysql.createConnection(CONFIG);


