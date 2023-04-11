import { Router } from "express";
import { addLocation } from "../services/locations.services.js";

export const location = Router();


// check the network for new devices and add them to the database
devices.get("/location/add", async (req, res) => {
    const data = await addLocation(res)
    res.send(data)
})
