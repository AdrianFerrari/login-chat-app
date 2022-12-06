import userAuthSchema from "../models/userAuthSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt)
            throw new Error("no token found on headers")
            /* return res
                .status(401)
                .json({ success: false, message: "no token found on headers" }); */
        const refreshToken = cookies.jwt;
        const user = await userAuthSchema.findOne({ refreshToken }).select("+refreshToken");
        if (!user)
            throw new Error("no user found with that refresh token")
            /* return res
                .status(403)
                .json({ success: false, message: "no user found with that refresh token" }); */
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            //el segundo userName el que esta encoded en el token en el login controller
            if (err || user.userName !== decoded.userName)
                return res.status(403).json({ success: false });
            const accessToken = jwt.sign(
                { "userName": decoded.userName },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30m" }
            );
            delete user._doc.refreshToken
            res.status(200).json({ success: true, accessToken, user });
        });
    } catch (error) {
        return res.status(403).json({ success: false, message: error.message });
    }
};

export default handleRefreshToken