import { Router } from "express";
import { currentTotalEnergyData, totalEnergyMonth  } from "../services/overview.services.js";
import { getTestMongo } from "../gateway/connectDB.js";

export const overview = Router();


overview.get("/overview/currenttotalenergydata", async (req, res) => {
    const data = await currentTotalEnergyData()
    res.send(data)
})

overview.get("/overview/totalenergymonth", async (req, res) => {
    const data = await totalEnergyMonth()
    res.send(data)
})

overview.get("/test", async (req, res) => {
    const data = await getTestMongo()
    res.send(data)
})