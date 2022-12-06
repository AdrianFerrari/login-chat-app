import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const userAuthSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
        select: false,
    },
    userComments: [
        new Schema(
            { comment: { type: String, trim: true } },
            { timestamps: true }
        ),
    ],
    refreshToken: { 
        type: String,
        select: false,
    },
});

userAuthSchema.pre("save", async function save(next) {
    if (!this.isModified("userPassword")) return next();
    try {
        this.userPassword = await bcrypt.hash(
            this.userPassword,
            SALT_WORK_FACTOR
        );
        return next();
    } catch (err) {
        return next(err);
    }
});

userAuthSchema.methods.validatePassword = async function validatePassword(
    data
) {
    return bcrypt.compare(data, this.userPassword);
};

export default model("users", userAuthSchema);
