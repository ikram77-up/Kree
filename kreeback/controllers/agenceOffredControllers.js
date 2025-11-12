import AgenceOffred from "../models/agenceOffred.js";
import Client from "../models/client.js";
import Agency from "../models/agency.js";
import Reservation from "../models/reservation.js";
import { sendNotification } from  "../controllers/noticationController.js";


//agence creer une offre 
export const createOffre = async (req, res) => {
    try {
        if (!req.isAgency) {
            return res.status(403).json({ message: "you are not agency" });
        }
        const { carId, nameyourpriceId, message } = req.body;
        if (!carId || !nameyourpriceId || !message) {
            return res.status(400).json({ message: "all fields are required" });
        }
        const car = await Car.findOne({ _id: carId, userId: req.user._id });
        if (!car) {
            return res.status(403).json({ message: "This car does not belong to your agency" });
        }
        const offre = await AgenceOffred.create({
            agenceId: req.user._id,
            carId,
            nameyourpriceId,
            message,
        });
        res.status(201).json({ message: "offre created successfully", offre });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//le client va voir tous les offres qui lui sont envoyees
export const getoffresforclient = async (req, res) => {
    try {
        if (!req.isClient) {
            return res.status(403).json({ message: "you are not client" });
        }
        const offres = await AgenceOffred.find()
            .populate({
                path: "nameyourpriceId",
                match: { userId: req.user._id },
                populate: { path: "userId", select: "name email" },
            })
            .populate("agenceId", "name email")
            .populate({
                path: "carId",
                select: "modelCar brand color image km fuelType gearBox seats features",
                populate: { path: "userId", select: "name role" },
            });
        const filteredOffres = offres.filter(o => o.nameyourpriceId);
        const offresWithProfiles = [];
        for (const offre of filteredOffres) {
            const offreObj = offre.toObject();
            if (offre.agenceId?.role === "agency") {
                const agencyProfile = await Agency.findOne({ user: offre.agenceId._id });
                offreObj.agencyProfile = agencyProfile;
            }
            offresWithProfiles.push(offreObj);
        }
        res.status(200).json(offresWithProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//agence repond au demande de client
export const answeroffrebyclient = async (req, res) => {
    try {
        const { offreId, status } = req.body;

        const offre = await AgenceOffred.findById(offreId)
            .populate("nameyourpriceId")
            .populate("carId");

        if (!offre) return res.status(404).json({ message: "offre not found" });

        offre.status = status;
        await offre.save();

        // Si acceptée envoye une notification a l'agence
        if (status === "accepted") {
            await sendNotification(
                offre.agenceId,
                "Offre acceptée ",
                "Le client a accepté votre offre.",
                "offre"
            );
        }

        res.status(200).json({ message: "Offre mise à jour", offre });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//agence voit tous ses offres
export const getMyOfrres = async (req, res) => {
    try {
        if (!req.isAgency) {
            return res.status(403).json({ message: "you are not agency" });
        }
        const offres = await AgenceOffred.find({ agenceId: req.user._id })
            .populate({
                path: "carId",
                select: "modelCar brand color image km fuelType gearBox seats features",
                populate: { path: "userId", select: "name role" },
            })
            .populate({
                path: "nameyourpriceId",
                populate: { path: "userId", select: "name email" },
            });
        const offresWithProfiles = [];
        for (const o of offres) {
            const offreObj = {
                _id: o._id,
                carId: o.carId,
                nameyourpriceId: o.nameyourpriceId,
                message: o.message,
                status: o.status
            };
            if (o.nameyourpriceId?.userId?.role === "client") {
                const clientProfile = await Client.findOne({ user: o.nameyourpriceId.userId._id });
                offreObj.clientProfile = clientProfile;
            }
            offresWithProfiles.push(offreObj);
        }
        res.status(200).json(offresWithProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
