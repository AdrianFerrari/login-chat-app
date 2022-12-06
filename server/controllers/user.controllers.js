import userAuthSchema from "../models/userAuthSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getUsers = async (req, res) => {
    try {
        const users = await userAuthSchema.find();
        if (!users)
            return res
                .status(404)
                .json({ success: false, message: "no users found" });
        //const newUsers = users.map(({refreshToken, userPassword, ...rest}) => rest)
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { userName } = req.body;
        const user = await userAuthSchema
            .findOne({ userName })
            .select("-userComments");
        if (!user)
            return res.status(404).json({
                success: false,
                message: "no user found with that name",
            });
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const handleSignUp = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;
        if (!userName || !userPassword)
            return res.status(401).json({
                sucess: false,
                message: "user name and password are required",
            });
        const user = await userAuthSchema({ userName, userPassword });
        await user.save();
        //res.status(200).json({ success: true, id: user._id });
        res.redirect(308, "/user/login");
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, code: error.code, message: error.message });
    }
};

const handleLogin = async (req, res) => {
    try {
        const { userName, userPassword } = req.body;
        if (!userName || !userPassword)
            return res.status(401).json({
                sucess: false,
                message: "user name and password are required",
            });
        const user = await userAuthSchema.findOne(
            { userName },
            "+userPassword -refreshToken"
        );
        if (!user)
            return res
                .status(401)
                .json({ success: false, message: "no user with that name" });

        //check if the password is valid
        const match = await user.validatePassword(userPassword);
        if (!match)
            return res
                .status(401)
                .json({ success: false, message: "incorrect password" });

         //generate jason web tokens
        const accessToken = jwt.sign(
            { userName: user.userName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        const refreshToken = jwt.sign(
            { userName: user.userName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
        );
        user.refreshToken = refreshToken;
        await user.save();
        //delete useless info from user to avoid sending it back to the client
        delete user._doc.userPassword;
        delete user._doc.refreshToken;
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ success: true, accessToken, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const postComment = async (req, res) => {
    try {
        const { userName, userComment } = req.body;
        const user = await userAuthSchema.findOne({ userName });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "no user with that name" });
        user.userComments.push({ comment: userComment });
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const handlePasswordChange = async (req, res) => {
    try {
        const { userName, newPassword, oldPassword } = req.body;
        const user = await userAuthSchema
            .findOne({ userName })
            .select("+userPassword");
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "no user with that name" });

        //check if the password is valid
        const match = await user.validatePassword(oldPassword);
        if (!match)
            return res
                .status(403)
                .json({ success: false, message: "incorrect password" });
        user.userPassword = newPassword;
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt)
            return res
                .status(200)
                .json({ success: true, message: "no token found on headers" });
        const refreshToken = cookies.jwt;
        const user = await userAuthSchema
            .findOne({ refreshToken })
            .select("+refreshToken");
        if (!user) {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
            return res.status(200).json({
                success: true,
                message: "no user found with that refresh token",
            });
        }
        user.refreshToken = "";
        await user.save();
        res.clearCookie("jwt", {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const editComment = async (req, res) => {
    try {
        const { comment: newcomment, user_id, _id: comment_id } = req.body;
        await userAuthSchema.findOneAndUpdate(
            { _id: user_id, "userComments._id": comment_id },
            { "userComments.$.comment": newcomment }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { user_id, _id: comment_id } = req.body;
        const user = await userAuthSchema.findById(user_id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "no user with that name" });
        user.userComments.id(comment_id).remove();
        await user.save();
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userName } = req.body;
        const user = await userAuthSchema.deleteOne({ userName });
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "no user with that name" });
        res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    getUsers,
    getUser,
    handleSignUp,
    handleLogin,
    postComment,
    handlePasswordChange,
    handleLogout,
    editComment,
    deleteComment,
    deleteUser,
};
