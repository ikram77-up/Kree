import Car from "../models/car.js";
import Agency from "../models/agency.js";

export const createCar = async (req, res) => {
    console.log("Body reçu :", req.body);
    try {
        if (!req.isAgency) {
            return res.status(403).json({ message: "You are not a loueur" });
        }
        const car = await Car.create({ ...req.body, userId: req.user._id });
        await car.populate("userId", "name role");
        res.status(201).json({ message: "Car created successfully", car });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().populate("userId", "name role");
        const carsWithProfiles = [];
        for (const car of cars) {
            const carObj = car.toObject();
            if (car.userId?.role === "agency") {
                const agencyProfile = await Agency.findOne({ user: car.userId._id });
                carObj.agencyProfile = agencyProfile;
            }
            carsWithProfiles.push(carObj);
        }
        res.status(200).json(carsWithProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCarbyId = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate("userId", "name role");
        if (!car) return res.status(404).json({ message: "Car not found" });
        const carObj = car.toObject();
        if (car.userId?.role === "agency") {
            const agencyProfile = await Agency.findOne({ user: car.userId._id });
            carObj.agencyProfile = agencyProfile;
        }
        res.status(200).json(carObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCar = async (req, res) => {
    try {
        if (!req.isAgency) {
            return res.status(403).json({ message: "You are not a loueur" });
        }
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        if (car.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not a loueur" });
        }
    
        Object.assign(car, req.body);
        await car.save();
        await car.populate("userId", "name role");
        const carObj = car.toObject();
        if (car.userId?.role === "agency") {
            const agencyProfile = await Agency.findOne({ user: car.userId._id });
            carObj.agencyProfile = agencyProfile;
        }
        res.status(200).json({ message: "Car updated successfully", car: carObj });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCar = async (req, res) => {
    try {
        if (!req.isAgency) {
            return res.status(403).json({ message: "You are not a loueur " });
        }
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        if (car.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not a loueur " });
        }
        await car.deleteOne();
        res.status(200).json({ message: "Car deleted successfully ", car });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
