import { Router } from "express";
import { delMqttData, getMqttData, mqttPub, mqttSubAuto, mqttSubMsg } from "../services/mqtt.services.js";

export const mqtt = Router();

mqtt.get("/mqtt/status", async (req, res) => {
    // console.log("Getting status of all devices publishing ")
    const data = await getMqttData()
    res.send(data)
})

mqtt.patch("/mqtt/subscribe", async (req, res) => {
    // console.log("Subscribing to Topic. Please wait.", req.body)
    let data
    const dropCollection = await delMqttData()
    if (dropCollection) {
        const dataSub = await mqttSubAuto(req.body)
        if(req.body.pubTopic[0] !== []){
            const dataMsg = await mqttSubMsg(req.body)
            const dataPub = await mqttPub(req.body)
            data = {"dataSub":dataSub,"dataPub":dataPub,"dataMsg":dataMsg}
        } else {
            data = {"dataSub":dataSub}
        }
        res.send(data)
    }
})