import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

function verifyJWT(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader)
        return res
            .status(401)
            .json({ success: false, message: "missing access token" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res
                .status(403)
                .json({ success: false, message: "invalid access token" });

        //first useName is from the client, the second is the one encoded into 
        //the token in jwt.sign in the login controller
        req.body.userName = decoded.userName;
        next();
    });
}

export default verifyJWT