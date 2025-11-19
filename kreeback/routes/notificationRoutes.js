import express from "express";
import {
    sendNotification,
    getNotificationCount
} from "../controllers/noticationController.js"

const routesNotification = express.Router();

routesNotification.post("/notifications", sendNotification);
routesNotification.get("/notifications/count", getNotificationCount);

export default routesNotification;