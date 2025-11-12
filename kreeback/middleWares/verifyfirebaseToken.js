import admin from "../config/firebaseconfig";

export const adminMiddleware = async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
    }
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // ici ou on stocke la requete de l'utilisateur
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token " });
    }
};