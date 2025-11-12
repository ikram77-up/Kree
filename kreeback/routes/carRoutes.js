import express from "express";
import {
    createCar,
    getAllCars,
    getCarbyId,
    updateCar,
    deleteCar
} from "../controllers/carControllers.js"
import { verifyToken } from "../middleWares/verifyToken.js"

const routesCar = express.Router();

routesCar.post("/car", verifyToken, createCar);
routesCar.get("/car", getAllCars);
routesCar.get("/car/:id", getCarbyId);
routesCar.put("/car/update/:id", verifyToken, updateCar);
routesCar.delete("/car/delete/:id", verifyToken, deleteCar);

export default routesCar;
