import express from "express";
import {
    sendNotification
} from "../controllers/noticationController.js"

const routesNotification = express.Router();

routesNotification.post("/notifications", sendNotification);

export default routesNotification;