import { Router } from "express";
import { default as controller } from "../controllers/user.controllers.js";
import handleRefreshToken from "../controllers/refreshToken.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = Router();

router.get("/all", controller.getUsers);

router.post("/signup", controller.handleSignUp);

router.post("/login", controller.handleLogin);

router.get("/logout", controller.handleLogout);

router.post("/comment", controller.postComment);

router.post("/comment/update", verifyJWT, controller.editComment)

router.post("/comment/delete", verifyJWT, controller.deleteComment)

router.post("/passchange", verifyJWT, controller.handlePasswordChange);

router.get("/refresh", handleRefreshToken);

router.post("/delete", verifyJWT, controller.deleteUser)

router.get("/", verifyJWT, controller.getUser);

export default router;
