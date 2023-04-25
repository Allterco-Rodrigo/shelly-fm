import * as mqtt from "mqtt"
import { getDeviceCurrentDataCollection, getDeviceMqttDataCollection } from '../gateway/connectDB.js';

export const getMqttConfig = async(IP) => {
    const currentDate = new Date();

    const col = await getDeviceCurrentDataCollection();
    const devices = await col
    .aggregate(
        [
            {
                '$match': {
                  'month': currentDate.month,
                  'year': currentDate.year,
                  'displayData': 0,
                  'mqttServer' : { $ne : null}
                }
            },
            {
                '$project': {
                'ip': '$ip',
                'gen':'$gen',
                'mqttClientId': '$mqttClientId',
                'mqttServer': '$mqttServer',
                }
          }
        ]
    )
    .toArray();

    return devices
}

export const mqttSub = async (obj) => {
        // console.log("mqttSub",obj)
        const client = mqtt.connect(`mqtt://${obj.server}`)

        if(client.connected){
            console.error('problem connecting')
            client.on('error',function(error){
                console.log("Can't connect" + error);
                process.exit(1)
            });
        } else {
            client.on('connect', () => {
                client.subscribe(obj.topic,{qos:1})
            })
            
            client.on('message',async (topic, data) => {
                const dataObj = JSON.parse(data.toString())
                const mongoObj = { 
                    "ip" : obj.ip,
                    "switch0" : 0,
                    "totalEnergy" : 0
                }

                if(dataObj.params['switch:0']){
                    if(dataObj.params['switch:0'].aenergy){
                        mongoObj.switch0 = dataObj.params['switch:0'].aenergy.total,
                        mongoObj.totalEnergy = dataObj.params['switch:0'].aenergy.total/1000
                    }
                }
                
                const res = await mqttMsgToMongo(mongoObj);
            })
        }

}

export const mqttMsgToMongo = async (obj) => {
   
    const col = await getDeviceMqttDataCollection()
    const doc = await col.findOneAndUpdate(   //update previous
        { ip: obj.ip },
        { $set: { 
            "switch0": obj.switch0, 
            "totalEnergy": obj.totalEnergy
        }},
        { upsert: true, returnOriginal: true }
    );
    return doc
}

export const getMqttStatus = async () => {
    const currentDate = new Date();

    const col = await getDeviceCurrentDataCollection()
    const devices = await col
    .aggregate(
        [
            {
                '$match': {
                  'month': currentDate.month,
                  'year': currentDate.year,
                  'displayData': 0,
                }
            },
            {
                '$project': {
                'ip': '$ip',
                'gen':'$gen',
                'mqttClientId': '$mqttClientId',
                'mqttServer': '$mqttServer',
                }
          }
        ]
    )
    .toArray();

    return devices
}