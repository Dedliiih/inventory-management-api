import mysql from "mysql2/promise";
import dotenv, { config } from "dotenv";
dotenv.config();

const CONFIG = {
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.DBPORT,
    password: process.env.DBPASSWORD,
    database: process.env.DB
};


export const dbConnection = await mysql.createConnection(CONFIG);


