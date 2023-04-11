import { Router } from "express";
import { addDiscoveredDevices, getConnectedDevices, patchConnectedDevices, refreshDevicesData,  } from "../services/devices.services.js";

export const devices = Router();
let a = 0

// check the network for new devices and add them to the database
devices.get("/list/reload", async (req, res) => {
    console.log("Reloading data. Please wait.")
    const data = await patchConnectedDevices()
    res.send(data)
})

// reload data from existing devices
devices.get("/list/refresh", async (req, res) => {
    console.log("Refreshing data. Please wait.")
    const data = await refreshDevicesData()
    res.send(data)
})

devices.get("/list", async (req, res) => {
    console.log("Retrieving data. Please wait.")
    const data = await getConnectedDevices()
    res.send(data)
})

devices.post("/device/add", async (req, res) => {
    console.log("Provisioning...")
    const data = await addDiscoveredDevices(req.body.ssid,req.body.pass,req.body.prefix)
    res.send(data)
})
