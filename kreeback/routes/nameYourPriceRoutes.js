import express from "express";
import {
    createPrice,
    getAllpropositionPrices,
    getAllpropositionPricesByCar,
    acceptpriceByAgence

} from "../controllers/nameYourPriceControllers.js"
import { verifyToken } from "../middleWares/verifyToken.js"

const routesNameYourPrice = express.Router();

routesNameYourPrice.post("/price", verifyToken, createPrice);
routesNameYourPrice.get("/price", verifyToken, getAllpropositionPrices);
routesNameYourPrice.get("/price/client", verifyToken, getAllpropositionPricesByCar);
routesNameYourPrice.put("/price/accept/:id", verifyToken, acceptpriceByAgence);

export default routesNameYourPrice;