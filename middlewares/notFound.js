import express from "express";

const app = express();

export const notFound = app.use((req, res) => {
    res.status(404).json({
        message: "endpoint not found"
    });
});