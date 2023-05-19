import { Router } from "express";
import { addDeviceTriggers, addDiscoveredDevices, delDeviceById, getConnectedDevices, 
    getDeviceById, getDeviceTriggers, patchConnectedDevices, refreshDevicesData, 
    updDeviceById,  } from "../services/devices.services.js";

export const devices = Router();

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

devices.get("/device/:id", async (req, res) => {
    console.log("Retrieving data from device. Please wait.")
    const data = await getDeviceById(req.params)
    res.send(data)
})

devices.post("/device/add", async (req, res) => {
    console.log("Provisioning...")
    const data = await addDiscoveredDevices(req.body)
    res.send(data)
})

devices.post("/device/trigger", async (req, res) => {
    console.log("Setting Triggers...")
    const data = await addDeviceTriggers(req.body)
    res.send(data)
})

devices.get("/device/trigger/:interval", async (req, res) => {
    console.log("Triggering devices...")
    const data = await getDeviceTriggers(req.params)
    res.send(data)
})

devices.patch("/device/upd/:id", async (req, res) => {
    console.log("Updating...")
    const data = await updDeviceById(req.params, req.body)
    res.send(data)
})

devices.patch("/device/del/:id", async (req, res) => {
    console.log("Deleting...")
    const data = await delDeviceById(req.params, req.body)
    res.send(data)
})
