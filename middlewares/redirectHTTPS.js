import express from "express";

const app = express();
export const redirectHttps = app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect(`https://${req.headers.host}${req.url}`);
    }
});