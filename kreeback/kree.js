import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import connectDB from "./config/connect_db.js";
import routes from "./routes/userRoutes.js";
import routesCar from "./routes/carRoutes.js";
import routesReservation from "./routes/reservationRoutes.js";
import routesAgenceOffred from "./routes/agenceOffredRoutes.js";
import routesNameYourPrice from "./routes/nameYourPriceRoutes.js";
import routesNotification from "./routes/notificationRoutes.js";

dotenv.config();

connectDB();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(routes);
app.use(routesCar);
app.use(routesReservation);
app.use(routesAgenceOffred);
app.use(routesNameYourPrice);
app.use(routesNotification);

const server = http.createServer(app);
export const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

//Gestion des connexions en temps réel 
export const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log(" New user connected:", socket.id);

    // Quand un Client s’identifie après connexion
    socket.on("registerClient", (userId) => {
        onlineUsers.set(userId.toString(), socket.id);
        // Le client rejoint sa propre "room" privée (pour recevoir des offres)
        socket.join(userId.toString());
        console.log(` Client ${userId} connected and joined room ${userId}`);
    });

    // Quand un Agence s’identifie
    socket.on("registerAgency", (agencyId) => {
        onlineUsers.set(agencyId.toString(), socket.id);
        // L'agence rejoint sa propre "room" privée (pour recevoir des acceptations)
        socket.join(agencyId.toString());
        // ET l'agence rejoint la "room" GLOBALE (pour recevoir les nouvelles demandes)
        socket.join('agencies_room');
        console.log(` Agency ${agencyId} joined 'agencies_room'`);
    });

    // Quand l’utilisateur quitte
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(` User ${userId} disconnected`);
                break;
            }
        }
    });
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
