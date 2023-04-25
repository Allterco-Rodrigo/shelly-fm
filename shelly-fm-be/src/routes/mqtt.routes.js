import { Router } from "express";
import { getMqttConfig, getMqttStatus, mqttSub } from "../services/mqtt.services.js";

export const mqtt = Router();

mqtt.get("/mqtt/status", async (req, res) => {
    console.log("Getting status of all devices publishing ")
    const data = await getMqttStatus()
    res.send(data)
})

mqtt.get("/mqtt/config", async (req, res) => {
    console.log("Getting MQTT ID to subscribe to. Please wait.")
    const data = await getMqttConfig()
    res.send(data)
})

mqtt.patch("/mqtt/subscribe", async (req, res) => {
    console.log("Subscribing to Topic. Please wait.")
    const data = await mqttSub(req.body)
    res.send(data)
})