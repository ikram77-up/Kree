import Notification from "../models/notification.js";
import { io, onlineUsers } from "../kree.js"

export const sendNotification = async (userId, title, message, type = "info") => {
    // Sauvegarde dans la base
    const notification = await Notification.create({ userId, title, message, type });

    // Envoi temps réel si user connecté
    const socketId = onlineUsers.get(userId.toString());
    if (socketId) {
        io.to(socketId).emit("notification", notification);
    }
};
