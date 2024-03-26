import jwt from "jsonwebtoken";
import "dotenv/config.js";

export function generateNewToken(userData) {

    const newData = {
        id: userData.id,
        username: userData.username,
        companyId: userData.companyId,
        rolId: userData.rolId
    };

    const updateToken = jwt.sign(
        newData,
        process.env.SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7
        }
    );

    return updateToken;
}
