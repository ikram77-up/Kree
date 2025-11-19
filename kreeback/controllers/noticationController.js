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

export const getNotificationCount = async (req, res) => {
    try {
        // Compter les notifications non lues pour l'utilisateur connecté
        const count = await Notification.countDocuments({
            userId: req.user._id,
            isRead: false
        });

        res.status(200).json({ count });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
