import express from "express";
import {
    registerUser,
    loginUser,
    getprofile,
    me,
    logout,
    firebaselogin
} from "../controllers/userControllers.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/profile", getprofile);
router.get("/user/me", me);
router.get("/user/logout", logout);
router.post("/user/firebase", firebaselogin);
export default router;  