import jwt from "jsonwebtoken";

const userExtractor = (req, res, next) => {
    try {
        const authorization = req.get("authorization");
        let token = null;

        if (authorization && authorization.toLowerCase().startsWith("bearer")) {
            token = authorization.substring(7);
        }

        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!token || !decodedToken.id) return res.status(401).json({ error: "token missing or invalid" });

        req.user = decodedToken;

        const { id: producto_id } = decodedToken;
        req.producto_id = producto_id;

        next();
    } catch (error) {
        return res.status(401).json(error.message);
    }
};

export default userExtractor;