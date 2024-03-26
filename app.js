import express, { json } from "express";
import cors from "cors";
import productsRoutes from "./routes/productsRoutes.js";
import countriesRoutes from "./routes/countriesRoutes.js";
import suppliersRoutes from "./routes/suppliersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import signRoutes from "./routes/signRoutes.js";
import { CorsError } from "./utils/errors/errors.js";
import { notFound } from "./middlewares/notFound.js";
import { redirectHttps } from "./middlewares/redirectHTTPS.js";

export const app = express();

app.disable("x-powered-by");
app.use(json());
app.use(
    cors({
        origin: (origin, callback) => {
            const ACCEPTED_ORIGINS = [
                "http://localhost:3000",
                "http://localhost:8080",
                "http://127.0.0.1:5500",
            ];

            if (ACCEPTED_ORIGINS.includes(origin)) {
                return callback(null, true);
            }

            if (!origin) {
                return callback(null, true);
            }

            return callback(new CorsError("Not allowed by CORS"));
        },
    })
);

// Routes

app.use(productsRoutes);
app.use(countriesRoutes);
app.use(suppliersRoutes);
app.use(companiesRoutes);
app.use(usersRoutes);
app.use(signRoutes);

// Some middlewares

app.use(notFound);
app.use(redirectHttps);
const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
});

export default server;
