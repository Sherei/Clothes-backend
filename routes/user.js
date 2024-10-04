const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");


router.post("/signUp", UserController.Signup);

router.post("/verify-email", UserController.VerifyEmail);

router.post("/forgot-password", UserController.ForgotPassword);

router.get("/reset-password/:token", UserController.ResetPassword);

router.post("/reset-password/:token", UserController.ResetPasswordToken);

router.put("/updateUserStatus", UserController.UpdateStatus);

router.post("/login", UserController.Login);

router.post("/session-check", UserController.SessionCheck);

router.get("/Users", UserController.GetUsers);

router.delete("/deleteUser", UserController.DeleteUser);



module.exports = router;