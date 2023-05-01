import * as mqtt from "mqtt"
import { mqttMsgToMongo } from '../gateway/connectDB.js';

export const mqttPub = async (obj) => {
    const delay = 60000; // 1 minute(s) in milliseconds
    const client = mqtt.connect(`mqtt://${obj.server}`)

    client.on('connect', () => {
        if(client.connected){
            for(let i = 0; i < obj.pubMsg.length; i++){
                setTimeout(() => {
                    client.publish(obj.pubTopic[i], obj.pubMsg[i], {qos: 1, retain: false}, (err)=>{err?console.error(err):""})
                    setInterval(() => {
                        client.publish(obj.pubTopic[i], obj.pubMsg[i], {qos: 1, retain: false}, (err)=>{err?console.error(err):""})
                    }, delay);
                  }, i * delay);
                
                // client.publish(obj.pubTopic[i], obj.pubMsg[i], {qos: 1})
                // console.log("PUB",obj.pubTopic[i], obj.pubMsg[i], {qos: 1})
            }
        } else {
            console.error('problem connecting')
        }        
    })

    client.on('error',function(error){
        console.log("Can't connect" + error);
    })

}

export const mqttSubMsg = async (obj) => {

    const client = mqtt.connect(`mqtt://${obj.server}`)

    client.on('connect', () => {
        if(client.connected){
            for(let i = 0; i < obj.pubMsg.length; i++){
                // console.log("Subscribing to RPC:",JSON.parse(obj.pubMsg[i]).src+"/rpc")
                client.subscribe(JSON.parse(obj.pubMsg[i]).src+"/rpc",{qos:1})
            }
        } else {
            console.error('problem connecting')
        }
    })
    
    client.on('message',async (topic, data) => {
        const dataObj = JSON.parse(data.toString()).result
        const mongoObj = { "ip" : obj.ip }

        let i = 0

        if(dataObj[`switch:${i}`]){

            if(dataObj[`switch:${i}`].voltage){
                mongoObj[`voltage${i}`] = dataObj[`switch:${i}`].voltage
            }

            if(dataObj[`switch:${i}`].current){
                mongoObj[`current${i}`] = dataObj[`switch:${i}`].current
            }

            if(dataObj[`switch:${i}`].apower){
                mongoObj[`power${i}`] = dataObj[`switch:${i}`].apower
                mongoObj[`totalPower${i}`] = dataObj[`switch:${i}`].apower/1000
            }
            
            if(dataObj[`switch:${i}`].aenergy){
                mongoObj[`aenergy${i}`] = dataObj[`switch:${i}`].aenergy.total,
                mongoObj[`totalEnergy${i}`] = dataObj[`switch:${i}`].aenergy.total/1000
            }

            mongoObj.sysMac = dataObj.sys.mac

            // console.log(mongoObj)    
            mqttMsgToMongo(mongoObj);
        }

// PUB shellyplugus-083af2018c80/rpc {"id":1, "src":"shellyplugus-083af2018c80-GetStatus", "method":"Shelly.GetStatus"} { qos: 1 }
// MSG RPC {"id":1,"src":"shellyplugus-083af2018c80","dst":"shellyplugus-083af2018c80-GetStatus",
// "result":{"ble":{},"cloud":{"connected":true},"mqtt":{"connected":true},
//     "switch:0":{"id":0, "source":"loopback", "output":true, "apower":10.7, "voltage":120.7, "current":0.133, 
//         "aenergy":{"total":46791.262,"by_minute":[73.921,177.749,177.749],"minute_ts":1682952864},
//         "temperature":{"tC":47.9, "tF":118.3}},"sys":{"mac":"083AF2018C80","restart_required":false,"time":"10:54","unixtime":1682952866,"uptime":347388,"ram_size":234824,"ram_free":159788,"fs_size":458752,"fs_free":94208,"cfg_rev":19,"kvs_rev":2,"schedule_rev":1,"webhook_rev":0,"available_updates":{}},"wifi":{"sta_ip":"192.168.15.138","status":"got ip","ssid":"Hercules","rssi":-45},"ws":{"connected":false}}} shellyplugus-083af2018c80-GetStatus/rpc     

// PUB shellyplus1pm-a8032ab9c910/rpc {"id":1, "src":"shellyplus1pm-a8032ab9c910-GetStatus", "method":"Shelly.GetStatus"} { qos: 1 }
// MSG RPC {"id":1,"src":"shellyplus1pm-a8032ab9c910","dst":"shellyplus1pm-a8032ab9c910-GetStatus",
// "result":{"ble":{},"cloud":{"connected":true},
//     "input:0":{"id":0,"state":false},"mqtt":{"connected":true},
//     "switch:0":{"id":0, "source":"HTTP", "output":true, "apower":10.8, "voltage":118.0, "current":0.147, 
//         "aenergy":{"total":19.545,"by_minute":[74.927,180.025,180.528],"minute_ts":1682952864},
//         "temperature":{"tC":51.9, "tF":125.4}},
//         "sys":{"mac":"A8032AB9C910","restart_required":false,"time":"10:54","unixtime":1682952866,"uptime":76864,"ram_size":248824,"ram_free":140820,"fs_size":458752,"fs_free":94208,"cfg_rev":65,"kvs_rev":3,"schedule_rev":0,"webhook_rev":0,"available_updates":{}},"wifi":{"sta_ip":"192.168.15.35","status":"got ip","ssid":"Romulus","rssi":-46},"ws":{"connected":false}}} shellyplus1pm-a8032ab9c910-GetStatus/rpc

// PUB shellyplus1-b8d61a883fc0/rpc {"id":1, "src":"shellyplus1-b8d61a883fc0-GetStatus", "method":"Shelly.GetStatus"} { qos: 1 }
// MSG RPC {"id":1,"src":"shellyplus1-b8d61a883fc0","dst":"shellyplus1-b8d61a883fc0-GetStatus",
// "result":{"ble":{},"cloud":{"connected":false},"input:0":{"id":0,"state":false},"mqtt":{"connected":true},
//     "switch:0":{"id":0, "source":"HTTP", "output":true,
//     "temperature":{"tC":46.8, "tF":116.2}},
//         "sys":{"mac":"B8D61A883FC0","restart_required":false,"time":"10:54","unixtime":1682952865,"uptime":6562,"ram_size":249280,"ram_free":148412,"fs_size":458752,"fs_free":98304,"cfg_rev":12,"kvs_rev":0,"schedule_rev":0,"webhook_rev":0,"available_updates":{"stable":{"version":"0.14.1"}}},
//         "wifi":{"sta_ip":"192.168.15.251","status":"got ip","ssid":"Romulus","rssi":-57},"ws":{"connected":false}}} shellyplus1-b8d61a883fc0-GetStatus/rpc

// PUB shellypro1-30c6f7847764/rpc {"id":1, "src":"shellypro1-30c6f7847764-GetStatus", "method":"Shelly.GetStatus"} { qos: 1 }
// MSG RPC {"id":1,"src":"shellypro1-30c6f7847764","dst":"shellypro1-30c6f7847764-GetStatus",
// "result":{"ble":{},"cloud":{"connected":true},"eth":{"ip":null},"input:0":{"id":0,"state":false},"input:1":{"id":1,"state":false},"mqtt":{"connected":true},
//     "switch:0":{"id":0, "source":"HTTP", "output":true,
//         "temperature":{"tC":30.0, "tF":85.9}},
//         "sys":{"mac":"30C6F7847764","restart_required":false,"time":"10:54","unixtime":1682952866,"uptime":260160,"ram_size":248624,"ram_free":122956,"fs_size":524288,"fs_free":167936,"cfg_rev":16,"kvs_rev":0,"schedule_rev":0,"webhook_rev":0,"available_updates":{}},
//         "wifi":{"sta_ip":"192.168.15.193","status":"got ip","ssid":"Romulus","rssi":-57},"ws":{"connected":false}}} shellypro1-30c6f7847764-GetStatus/rpc
        
        if(dataObj[`em:${i}`]){
            mongoObj.a_act_power = dataObj[`em:${i}`].a_act_power
            mongoObj.a_aprt_power = dataObj[`em:${i}`].a_aprt_power
            mongoObj.a_current = dataObj[`em:${i}`].a_current
            mongoObj.a_pf = dataObj[`em:${i}`].a_pf
            mongoObj.a_voltage = dataObj[`em:${i}`].a_voltage
            mongoObj.b_act_power = dataObj[`em:${i}`].b_act_power
            mongoObj.b_aprt_power = dataObj[`em:${i}`].b_aprt_power
            mongoObj.b_current = dataObj[`em:${i}`].b_current
            mongoObj.b_pf = dataObj[`em:${i}`].b_pf
            mongoObj.b_voltage = dataObj[`em:${i}`].b_voltage
            mongoObj.c_act_power = dataObj[`em:${i}`].c_act_power
            mongoObj.c_aprt_power = dataObj[`em:${i}`].c_aprt_power
            mongoObj.c_current = dataObj[`em:${i}`].c_current
            mongoObj.c_pf = dataObj[`em:${i}`].c_pf
            mongoObj.c_voltage = dataObj[`em:${i}`].c_voltage
            mongoObj.n_current = dataObj[`em:${i}`].n_current
            mongoObj.total_act_power = dataObj[`em:${i}`].total_act_power
            mongoObj.total_aprt_power = dataObj[`em:${i}`].total_aprt_power
            mongoObj.total_current = dataObj[`em:${i}`].total_current
            mongoObj.sysMac = dataObj.sys.mac
            // console.log(mongoObj)
            mqttMsgToMongo(mongoObj);
        }
      
// PUB shellypro3em-ec6260890b50/rpc {"id":1, "src":"shellypro3em-ec6260890b50-GetStatus", "method":"Shelly.GetStatus"} { qos: 1 }
// MSG RPC {"id":1,"src":"shellypro3em-ec6260890b50","dst":"shellypro3em-ec6260890b50-GetStatus",
// "result":{"ble":{},"cloud":{"connected":true},
    // "em:0":{"id":0,"a_current":3.761,"a_voltage":121.7,"a_act_power":342.8,"a_aprt_power":457.5,"a_pf":-0.80,"b_current":8.109,"b_voltage":121.0,"b_act_power":957.3,"b_aprt_power":980.7,"b_pf":-0.98,"c_current":0.025,"c_voltage":121.7,"c_act_power":0.2,"c_aprt_power":3.1,"c_pf":-1.00,"n_current":null,"total_current":11.896,"total_act_power":1300.252,"total_aprt_power":1441.226, "user_calibrated_phase":[]},
    // "emdata:0":{"id":0,"a_total_act_energy":1075513.08,"a_total_act_ret_energy":0.00,"b_total_act_energy":1776542.72,"b_total_act_ret_energy":0.00,"c_total_act_energy":0.01,"c_total_act_ret_energy":0.00,
    // "total_act":2852055.81, "total_act_ret":0.00},
    // "eth":{"ip":null},
    // "modbus":{},
    // "mqtt":{"connected":true},
    // "sys":{"mac":"EC6260890B50","restart_required":false,"time":"10:54","unixtime":1682952865,"uptime":260530,"ram_size":246700,"ram_free":105248,"fs_size":524288,"fs_free":172032,"cfg_rev":15,"kvs_rev":0,"webhook_rev":0,"available_updates":{}},"temperature:0":{"id": 0,"tC":47.0, "tF":116.5},"wifi":{"sta_ip":"192.168.15.68","status":"got ip","ssid":"Romulus","rssi":-52},"ws":{"connected":false}}} shellypro3em-ec6260890b50-GetStatus/rpc
    
        // console.log("MANU \n",mongoObj, "\n\n")
    })
    
    client.on('error',function(error){
        console.log("Can't connect" + error);
    });    

}

export const mqttSubAuto = async (obj) => {

    const client = mqtt.connect(`mqtt://${obj.server}`)

    client.on('connect', () => {
        if(client.connected){
            for(let i = 0; i < obj.subTopic.length; i++){
                // console.log("Subscribing to AUTO PUB:",obj.subTopic[i])
                client.subscribe(obj.subTopic[i],{qos:1})
            }
        } else {
            console.error('problem connecting')
        }
    })
    
    client.on('message',async (topic, data) => {
        // console.log("MSG AUT",data.toString())
        const mongoObj = { "ip" : obj.ip }
        // need to store data from different relays/inputs in an array
        
        if(topic.includes("/events/rpc")){
            const dataObj = JSON.parse(data.toString())
            
            let i = 0
            if(typeof topic.split("/",4)[4] == 'number')
                i = topic.split("/",4)[4]
            
            if(dataObj.params[`switch:${i}`]){
                if(dataObj.params[`switch:${i}`].aenergy){
                    mongoObj[`switch${i}`] = dataObj.params[`switch:${i}`].aenergy.total,
                    mongoObj[`totalEnergy${i}`] = dataObj.params[`switch:${i}`].aenergy.total/1000
                }
                
                if(dataObj.params[`switch:${i}`].current){
                    mongoObj[`current${i}`] = dataObj.params[`switch:${i}`].current
                }
                
                if(dataObj.params[`switch:${i}`].apower){
                    mongoObj[`switch${i}`] = dataObj.params[`switch:${i}`].apower
                    mongoObj[`totalEnergy${i}`] = dataObj.params[`switch:${i}`].apower/1000
                }
 
                // console.log(mongoObj, "\n\n")
                mqttMsgToMongo(mongoObj);
                
            }
            
            if(dataObj.params[`em:${i}`]){
                mongoObj.a_act_power = dataObj.params[`em:${i}`].a_act_power
                mongoObj.a_aprt_power = dataObj.params[`em:${i}`].a_aprt_power
                mongoObj.a_current = dataObj.params[`em:${i}`].a_current
                mongoObj.a_pf = dataObj.params[`em:${i}`].a_pf
                mongoObj.a_voltage = dataObj.params[`em:${i}`].a_voltage
                mongoObj.b_act_power = dataObj.params[`em:${i}`].b_act_power
                mongoObj.b_aprt_power = dataObj.params[`em:${i}`].b_aprt_power
                mongoObj.b_current = dataObj.params[`em:${i}`].b_current
                mongoObj.b_pf = dataObj.params[`em:${i}`].b_pf
                mongoObj.b_voltage = dataObj.params[`em:${i}`].b_voltage
                mongoObj.c_act_power = dataObj.params[`em:${i}`].c_act_power
                mongoObj.c_aprt_power = dataObj.params[`em:${i}`].c_aprt_power
                mongoObj.c_current = dataObj.params[`em:${i}`].c_current
                mongoObj.c_pf = dataObj.params[`em:${i}`].c_pf
                mongoObj.c_voltage = dataObj.params[`em:${i}`].c_voltage
                mongoObj.n_current = dataObj.params[`em:${i}`].n_current
                mongoObj.total_act_power = dataObj.params[`em:${i}`].total_act_power
                mongoObj.total_aprt_power = dataObj.params[`em:${i}`].total_aprt_power
                mongoObj.total_current = dataObj.params[`em:${i}`].total_current

                mqttMsgToMongo(mongoObj);
            }
            
            // console.log("MSG AUTO 1", obj.ip, "\n", dataObj, "\n", topic, "\n")
            
        }

        if(topic.includes("0\/status")){
            const dataObj = data.toString()
            // console.log("MSG AUTO 2", obj.ip, "\n", dataObj, "\n", topic, "\n")

            let i = 0
            if(typeof topic.split("/",4)[4] == 'number')
                i = topic.split("/",4)[4]

            if(dataObj.power)
                mongoObj[`switch${i}`] = dataObj.power

            if(dataObj.overpower)
                mongoObj[`overPower${i}`] = dataObj.overpower

            mqttMsgToMongo(mongoObj);

        }

        if (!topic.includes("/events/rpc") && !topic.includes("0\/status")){
            const dataObj = data.toString()
            // console.log("MSG AUTO 3", obj.ip, "\n", dataObj, "\n", topic, "\n")
            let i = 0
            if(typeof topic.split("/",4)[4] == 'number')
                i = topic.split("/",4)[4]
            
            if(topic.split("/",5)[5] === "power")
                mongoObj[`switch${i}`] = dataObj
                mqttMsgToMongo(mongoObj);

            if(topic.includes("energy"))
                mongoObj[`totalEnergy${i}`] = dataObj
                mqttMsgToMongo(mongoObj);

            if(topic.split("/",3)[3] === "temperature")
                mongoObj[`temperatureC${i}`] = dataObj
                mqttMsgToMongo(mongoObj);

            if(topic.includes("temperature_f"))
                mongoObj[`temperatureF${i}`] = dataObj
                mqttMsgToMongo(mongoObj);

            if(topic.includes("loaderror"))
                mongoObj[`loaderror${i}`] = dataObj
                mqttMsgToMongo(mongoObj);

            if(topic.split("/",4)[4] === undefined)
                mongoObj[`status${i}`] = dataObj
                mqttMsgToMongo(mongoObj);
            
        }

        // console.log("AUTO \n",mongoObj, "\n\n")

    })
    
    client.on('error',function(error){
        console.log("Can't connect" + error);
    });        
    
}
