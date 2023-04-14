import { getDeviceCurrentDataCollection, getDeviceHistoricDataCollection } from "../gateway/connectDB.js";
import { scanConnectedDevicesToDb } from "../nmapScan.js";
import fetch from "node-fetch";
import { presentDate, yesterday } from "../supportFunctions.js";
import { provisionDevice } from "../linuxScan.js";
import { ObjectId } from "mongodb";

let done = true

export const patchConnectedDevices = async () => {
    scanConnectedDevicesToDb()   // call nmap  
};

// update data from already listed devices
export const refreshDevicesData = async () => {
  getConnectedDevices()
    .then(dev=>{
      addShellyDevice(dev)
      done = true
    })
    .catch(()=>{
      console.log("Error Refreshing Device's Data")
      done = false
    })
  return done
};

// return existing data from devices already in DB
export const getConnectedDevices = async () => {
  // Connect to DB and get all devices 
  const col = await getDeviceCurrentDataCollection();
  const devices = await col
    .aggregate([

      {
        '$match': {
          'displayData' : 0,  //we only bring back those allowed to be displayed 
        }
      },{
        $project: {
          key: "$_id",
          ip: "$ip", 
          name: "$name",
          gen: "$gen",
          deviceStatus: "$deviceStatus",
          deviceType: "$deviceType",
          currentFWVersion: "$currentFWVersion",
          newFWAvailable: "$newFWAvailable",
          deviceLink: "$deviceLink",
          wifi : "$wifi",
          wifiStatus : "$wifiStatus",
          mqtt : "$mqtt",
          mqttServer : "$mqttServer",
          mqttClientId : "$mqttClientId",
          totalEnergy : "$totalEnergy",
          amp0 : "$amp0",
          amp1 : "$amp1",
          amp2 : "$amp2",
          amp3 : "$amp3",
          voltage0 : "$voltage0",
          voltage1 : "$voltage1",
          voltage2 : "$voltage2",
          voltage3 : "$voltage3",
          aenergy0 : "$aenergy0",
          aenergy1 : "$aenergy1",
          aenergy2 : "$aenergy2",
          aenergy3 : "$aenergy3",
          switch0 : "$switch0",
          switch1 : "$switch1",
          switch2 : "$switch2",
          switch3 : "$switch3",
        }
      },
      { $sort : { 
          deviceStatus : 1,
          aenergy0 : 1,
          name: 1,
          ip : 1
        } 
      }

    ])
  .toArray();
  if(devices.length !== 0) {
    return devices;
  }
  else 
    console.log("No data returned")
    return false
};

export const getDeviceById = async (id) => {
  const col = await getDeviceCurrentDataCollection();
  const device = await col.findOne({ _id: new ObjectId(id) });
  return device
}

// adds/updates only shelly products to the list
export const addShellyDevice = async (obj) => {
  // when calling the function from Nmap, obj is an ARRAY result of nmap
  if(Array.isArray(obj)){
    // call addShellyDevice outside nmap recursively to go through all devices found
    let i = 0
    obj.forEach((device,index) => {
      i = index + 1
        // console.log('Device',i,':',device.ip)
        addShellyDevice(device)      
    });
    if(i===obj.length){
      console.log(obj.length,'device(s) found')
      return obj.length
    }
  } else {
    // when calling outside of nmap, obj is an OBJECT containing the key 'ip'
    let success = true
    const currentDate = new Date();
    const previousDate = yesterday(currentDate);
    const today = presentDate();

    const docInfo = await getDeviceInfo(obj.ip)   // gen 1 = /settings
    
    // If docInfo.error exists then that IP address does not belong to a Shelly device 
    // or the shelly device is not connected 
    if(!docInfo.error){  
      // console.log ("Connecting to device", obj.ip)
      let keyTimeStamp = new Date();
      let powerTotalConsumption = "N/A";
      let totalConsumption = ["N/A",0,0,0];
      let devVoltage = ["N/A",0,0,0];
      let currentAmp = ["N/A",0,0,0];
      let outputConsumption = ["N/A",0,0,0];
      let meterTotalConsumption = ["N/A",0,0,0];
      let wifiStatus = 1; // not connected to wifi
      let devStatus = 1;  // not connected to power
      let deviceName = [];
      let curFwVer = "";
      let newFwVer = "";
      let wifi = "Disconnected";
      let mqtt = false;
      let mqtt_server = "N/A";
      let mqtt_client_id = "";
      let gen = -1;
      let deviceType = "Switch";  

      // Once we know the IP we can get extra info for the devices
      const docStatus = await getStatus(obj.ip)       // gen 1 = /status
      const docConfig = await getConfig(obj.ip)       // gen 1 = /settings
      const docChkUpd = await checkForUpdate(obj.ip)  // gen 1 = /ota
      
      if(docInfo.gen1){
        //---------------- GEN 1 DEVICES ----------------------
        // console.log(obj.ip,"G1")
        gen = 1
        if (docConfig.gen1.hasOwnProperty("lights")){
          deviceType = "Light"
          if(docConfig.gen1["lights"][0].ison)
            devStatus = 0
        }

        curFwVer = docInfo.gen1.fw                // '20221027-092056/v1.12.1-ga9117d3'

        try {
          if(!docChkUpd.gen1.hasOwnProperty("has_update")){
            if(!docChkUpd.gen1.error)
              newFwVer = 'Latest stable firmware installed'
            else
              newFwVer = 'Error retrieving firmware data from the cloud'
          } else {
            newFwVer = 'Stable version ' + docChkUpd.gen1.new_version + ' available'          
          }
        } catch (error) {
          // no "has_update" key
        }

        mqtt = docConfig.gen1.mqtt.enable           // false,
        mqtt_server = docConfig.gen1.mqtt.server    // '192.168.33.3:1883',
        mqtt_client_id = docConfig.gen1.mqtt.id     // 'shellyswitch25-E8DB84A259B3',

        wifi = docInfo.gen1.wifi_sta.ssid         // 'FAMHQ',
        wifiStatus = 0
        
        if(!docInfo.gen1.name){  // name === null then user didn't name the device
          deviceName.push('Shelly ' + docInfo.gen1.device.type)   // 'Shelly SHSW-25
        } else {
          deviceName.push(docInfo.gen1.name)                      // 'Lights Master'
        }          
        
        try {
          if(docStatus.gen1.relays){
            let relayStatus = 0
            
            devVoltage[0] = docInfo.gen1.supply_voltage === 1 ? 220 : 110   // supply_voltage = 0 | 1 -> 110 | 220

            for(let a=0; a < docStatus.gen1.meters.length; a ++){
              outputConsumption[a] = docStatus.gen1.meters[a].power
              currentAmp[a] = outputConsumption[a] / devVoltage[a]
              meterTotalConsumption[a] = docStatus.gen1.meters[a].total
              docStatus.gen1.relays[a].ison? relayStatus = relayStatus + 1 : ""
              // console.log("GEN1:",`devVoltage[${a}]`,devVoltage[a],`currentAmp[${a}]`,currentAmp[a])
            }
            // if the relayStatus > 0 then at least one of the relays is ON
            relayStatus>0 ? devStatus = 0 : devStatus = 1
            
            if(outputConsumption[0]>0 || outputConsumption[1]>0 || outputConsumption[2]>0 || outputConsumption[3]>0){
              totalConsumption[0] = outputConsumption[0]+outputConsumption[1]+outputConsumption[2]+outputConsumption[3]
              powerTotalConsumption = meterTotalConsumption[0]+meterTotalConsumption[1]+meterTotalConsumption[2]+meterTotalConsumption[3]
            }
            // console.log("totalConsumption[0]",totalConsumption[0],"powerTotalConsumption",powerTotalConsumption)
          }
          
        } catch (error) {
          // not a relay
        }
      }

      if(docInfo.gen2) {
        //---------------- GEN 2 DEVICES ----------------------
        // console.log(obj.ip,"G2")
        gen = docInfo.gen2.gen                    // 2,

        if (docStatus.gen2.hasOwnProperty("light:0")){
          deviceType = "Light"
          if(docStatus.gen2["light:0"].output)
          devStatus = 0
        }
        
        if (docInfo.gen2.app.toLowerCase() === "PlusI4".toLowerCase()){
          deviceType = docInfo.gen2.app
          devStatus = 0
        }

        // check for firmware update
        
        curFwVer = docInfo.gen2.fw_id             // '20230209-131418/0.13.0-g68ba560',

        try {
          
          if(docChkUpd.gen2.stable){        
            newFwVer = 'Stable version ' + docChkUpd.gen2.stable.version + ' available'
          } else {
            if(!docChkUpd.gen2.error)
            newFwVer = 'Latest stable firmware installed'
            else
            newFwVer = 'Error retrieving firmware data from the cloud'
          }
          
        } catch (error) {
            // no "stable" key
        }
        // wifi requires extra data
        wifi = docStatus.gen2.wifi.ssid
        wifiStatus = 0

        // mqtt requires extra data
        mqtt = docConfig.gen2.mqtt.enable           // false,
        mqtt_server = docConfig.gen2.mqtt.server    // '192.168.33.3:1883',

        mqtt_client_id = docInfo.gen2.id                  // 'shellyplugus-083af201c63c',

        if(!docInfo.gen2.name){  // name === null then user didn't name the device
          deviceName.push('Shelly ' + docInfo.gen2.app)   // 'Shelly PlugUS'
        } else {
          deviceName.push(docInfo.gen2.name)              // 'Coffee',
        }
        
        // devices can have 1-4 channels 

        if (docStatus.gen2.hasOwnProperty('switch:0')){  // device measures power
          
          docStatus.gen2['switch:0'].output ? devStatus = 0 : devStatus = 1
          
          for(let a = 0; a < 4; a++){
            try {
              if(docStatus.gen2[`switch:${a}`].voltage){

                devVoltage[a] = docStatus.gen2[`switch:${a}`].voltage + 0.00000000001
                currentAmp[a] = docStatus.gen2[`switch:${a}`].apower / devVoltage[a]
                outputConsumption[a] = docStatus.gen2[`switch:${a}`].apower // total energy that went through the device
                meterTotalConsumption[a] = docStatus.gen2[`switch:${a}`].aenergy.total
                // console.log(`devVoltage[${a}]`,devVoltage[a],`currentAmp[${a}]`,currentAmp[a])
              }
            } catch (error) {
              a = 5 // exit the loop
            }
          }

          if(outputConsumption[0] !== 'N/A' || outputConsumption[1]>0 || outputConsumption[2]>0 || outputConsumption[3]>0){
            // instantaneously consumption
            totalConsumption[0] = outputConsumption[0]+outputConsumption[1]+outputConsumption[2]+outputConsumption[3]
            // cumulative consumption of the day
            meterTotalConsumption[0]!=='N/A'
              ?powerTotalConsumption = (meterTotalConsumption[0]+meterTotalConsumption[1]+meterTotalConsumption[2]+meterTotalConsumption[3])/1000
              :powerTotalConsumption = (meterTotalConsumption[1]+meterTotalConsumption[2]+meterTotalConsumption[3])/1000
          }           
          // console.log("totalConsumption[0]",totalConsumption[0],"powerTotalConsumption",powerTotalConsumption)
        }

        if (docStatus.gen2.hasOwnProperty('em:0')){ // device is an Energy Meter
          // energy meters are always on
          devStatus = 0
          devVoltage[0] = docStatus.gen2['em:0'].a_voltage
          devVoltage[1] = docStatus.gen2['em:0'].b_voltage
          devVoltage[2] = docStatus.gen2['em:0'].c_voltage

          // consumption for each channel
          meterTotalConsumption[0] = docStatus.gen2['em:0'].a_act_power
          meterTotalConsumption[1] = docStatus.gen2['em:0'].b_act_power
          meterTotalConsumption[2] = docStatus.gen2['em:0'].c_act_power

          // amperage for each channel
          currentAmp[0] = docStatus.gen2['em:0'].a_current
          currentAmp[1] = docStatus.gen2['em:0'].b_current
          currentAmp[2] = docStatus.gen2['em:0'].c_current

          // sum of all channels
          totalConsumption[0] = docStatus.gen2['em:0'].total_act_power
          
          // cumulative consumption of the day
          powerTotalConsumption = docStatus.gen2['emdata:0'].total_act/1000
          // console.log("GEN2:",`devVoltage[${0}]`,devVoltage[0],`currentAmp[${0}]`,currentAmp[0],"totalConsumption[0]",totalConsumption[0],"powerTotalConsumption",powerTotalConsumption)

        }


      }

      // SAVING DATA TO DATABASE
      // assuming we are running the script at 00:00:01 of the day
      // we need to save the data that is current in the "devicesCurrentData" collection
      // to the "devicesHistoricData" collection

      const col = await getDeviceCurrentDataCollection();
      const deviceLastData = await col
        .aggregate(
          [
            {
              '$match': {
                'ip' : obj.ip,
                'day': previousDate.day,      // because we are already in the next day, 
                'month': previousDate.month,  // the data in the "devicesCurrentData" collection
                'year': previousDate.year     // will be from the previous day
              }
            }, {
              '$project': {
                'ip': '$ip', 
                'year': '$year', 
                'month': '$month', 
                'day': '$day', 
                'totalEnergy': '$totalEnergy'
              }
            }
          ]
        )
        .toArray();

      // deviceLastData will return a value only when the data in the "devicesCurrentData" collection is from the previous day
      // as soon as the script finishes, it will update the data in the "devicesCurrentData" collection with the data from the present day
      // in this case, we only run the function bellow if the deviceLastData has a value
      if(deviceLastData && deviceLastData.length > 0){

        try {
        const hist = await getDeviceHistoricDataCollection();
        // we check in the "devicesHistoricData" if any data from the previous day exists (answer should be NO)
        // then we create or replace the data 
        const doc = await hist.findOneAndUpdate(
          {ip: obj.ip, day : previousDate.day, month : previousDate.month, year : previousDate.year},
          { $set: {
            ip: obj.ip,
            day : previousDate.day, 
            month : previousDate.month,
            year : previousDate.year,
            totalEnergy: (deviceLastData.length!==0?deviceLastData[0].totalEnergy:0),
            name: deviceName[0],
            gen: gen,
            deviceType: deviceType,
            }
          },
          { upsert: true, returnOriginal: true } 
        );
        // console.log(obj.ip, "Historic data created", doc)
        } catch (e) {
          console.error(obj.ip,'ERROR trying to save historic data',e,deviceLastData);
          success = false
        };

      } else {
        // if the data in the "devicesCurrentData" collection is only from today or it doesn't exist
        // this is the first time we are running the program
        // console.error(obj.ip,'No previous data in the "devicesHistoricData" collection');
      }


      // if we successfully created the historic data or it is the first time we are running the program
      // now we create the document in the "devicesCurrentData" collection with new data
      if (success) {
        try {
          const col = await getDeviceCurrentDataCollection();
          const doc = await col.findOneAndUpdate(   //add new or update previous
            {$and: [
              {ip: obj.ip}, 
              {displayData : {$ne : 2}}
            ]},
            { $set: {
                key: keyTimeStamp.getTime(),
                year: today.year,
                month: today.month,
                day: today.day,
                ip: obj.ip, 
                createdAt: new Date(),
                name: deviceName[0],
                gen: gen,
                deviceType: deviceType,
                deviceStatus: devStatus,
                currentFWVersion: curFwVer,
                newFWAvailable: newFwVer,
                deviceLink: 'http://' + obj.ip,
                wifi : wifi,
                wifiStatus : wifiStatus,
                mqtt : mqtt,
                mqttServer: mqtt_server,
                mqttClientId: mqtt_client_id,
                totalEnergy: powerTotalConsumption,
                amp0 : currentAmp[0],
                amp1 : currentAmp[1],
                amp2 : currentAmp[2],
                amp3 : currentAmp[3],
                voltage0 : devVoltage[0],
                voltage1 : devVoltage[1],
                voltage2 : devVoltage[2],
                voltage3 : devVoltage[3],
                aenergy0 : totalConsumption[0],
                aenergy1 : totalConsumption[1],
                aenergy2 : totalConsumption[2],
                aenergy3 : totalConsumption[3],
                switch0 : meterTotalConsumption[0],
                switch1 : meterTotalConsumption[1],
                switch2 : meterTotalConsumption[2],
                switch3 : meterTotalConsumption[3],
                displayData : 0,
              }
            },
            { upsert: true, returnOriginal: true }
          );
        } catch (e) {
          console.error(obj.ip,'ERROR - No data saved or updated in the "devicesCurrentData" collection',e);
        }
      } else {
        console.error(obj.ip,'ERROR creating historic data - No current data created')
      }

    } else {
      // if the docInfo.ip is in the database then we couldn't connect to it so, we set displayData = 1
      const col = await getDeviceCurrentDataCollection();
      const doc = await col.findOneAndUpdate(   //update previous
          {$and: [
            {ip: obj.ip}, 
            {displayData : {$ne : 2}}
          ]},
          { $set: {      
            displayData : 1,
            }
          },
          { upsert: false, returnOriginal: true }
      );        
      // if it doesn't find the ip in the database, it will return an error but we don't mind
    }
  }
}

export const updDeviceById = async (id,obj) => {
  const col = await getDeviceCurrentDataCollection();
  obj.updatedAt = new Date();
  delete obj.password
  delete obj.mqttPassword
  await col.updateOne({ _id: new ObjectId(id) }, { $set: obj });
  
  // provision
  console.log("Sending command to device")
  let command

  if(obj.wifi !== "")
    if(obj.deviceGen === 1){
      command = `http://${obj.deviceIp}/settings/sta?ssid=${obj.wifi}&key=${obj.password}&enabled=1`
    } else {
      command = `http://${obj.deviceIp}/rpc/WiFi.SetConfig?config={"sta":{"ssid":"${obj.wifi}","pass":"${obj.password}","enable":true}}` 
    }
  else {
    if(obj.mqttServer !== "")
      if(obj.deviceGen === 1){
          command = `http://${obj.deviceIp}/settings?mqtt_server=${obj.mqttServer}&mqtt_pass=${obj.mqttPassword}&mqtt_enable=true`
      } else {
          command = `http://${obj.deviceIp}/rpc/MQTT.SetConfig?config={"server":"${obj.mqttServer}","pass":"${obj.mqttPassword}","enable":true}` 
      }
      else {
        if(obj.deviceName !== "")
          if(obj.deviceGen === 1){
              command = `http://${obj.deviceIp}/settings/?name=${obj.deviceName}`
          } else {
              command = `http://${obj.deviceIp}/rpc/Sys.SetConfig?config={"device":{"name":"${obj.deviceName}"}}` 
          }
        
      }
  }
  try {
      // console.log(command)
      const x = await fetch(command)
  } catch (error) {
      console.error("ERROR \n\n",error)
  }
}

export const delDeviceById = async (id,obj) => {
  const col = await getDeviceCurrentDataCollection();
  obj.deletedAt = new Date();
  obj.displayData = 2
  delete obj.password
  delete obj.mqttPassword
  await col.updateOne({ _id: new ObjectId(id) }, { $set: obj });
  
  // provision
  console.log("Sending command to device")
  let command

    if(obj.deviceGen === 1){
      command = `http://${obj.deviceIp}/settings/reset`
    } else {
      command = `http://${obj.deviceIp}/rpc/Shelly.FactoryReset` 
    }

  try {
      console.log(command)
      const x = await fetch(command)
  } catch (error) {
      console.error("ERROR \n\n",error)
  }
}


// getting information from the device
export async function getDeviceInfo(ip) {
  
  try {
    const res = await fetch(`http://${ip}/settings`);  
    const data = await res.json();
    // console.log({"gen1":data})
    return {"gen1":data}
  } catch (error) {
    // console.error(ip, "ERROR getDeviceInfo - FETCH GEN 1")
  }
  
  try {
    const res = await fetch(`http://${ip}/rpc/Shelly.GetDeviceInfo`);
    const data = await res.json();
    // console.log({"gen2":data})
    return {"gen2":data}
  } catch (error) {
    // console.error(ip, "ERROR getDeviceInfo - FETCH GEN 2")
  }
  
  return {"error":'Device might be asleep or disconnected from power',"ip":ip}

}

export async function getStatus(ip) {

  try {
    const res = await fetch(`http://${ip}/status`);  
    const data = await res.json();
    // console.log({"gen1":data})
    return {"gen1":data}
  } catch (error) {
    // console.error(ip, "ERROR getStatus - FETCH GEN 1")
  }
  
  try {
    const res = await fetch(`http://${ip}/rpc/Shelly.GetStatus`);
    const data = await res.json();
    // console.log({"gen2":data})
    return {"gen2":data}
  } catch (error) {
    // console.error(ip, "ERROR getStatus - FETCH GEN 2")
  }
  
  return {"error":'Device might be asleep or disconnected from power',"ip":ip}

}

export async function getConfig(ip) {

  try {
    const res = await fetch(`http://${ip}/settings`);  
    const data = await res.json();
    // console.log({"gen1":data})
    return {"gen1":data}
  } catch (error) {
    // console.error(ip, "ERROR getStatus - FETCH GEN 1")
  }
  
  try {
    const res = await fetch(`http://${ip}/rpc/Shelly.GetConfig`);
    const data = await res.json();
    // console.log({"gen2":data})
    return {"gen2":data}
  } catch (error) {
    // console.error(ip, "ERROR getStatus - FETCH GEN 2")
  }
  
  return {"error":'Device might be asleep or disconnected from power',"ip":ip}

}

export async function checkForUpdate(ip) {
  let retObj = {}
  try {
    const res = await fetch(`http://${ip}/ota`);  
    const data = await res.json();
    // console.log({"gen1":data})
    return {"gen1":data}
  } catch (error) {
    retObj = {"gen1":{"has_update":false, "error":true}}
    // console.error(ip, "ERROR checkForUpdate - FETCH GEN 1")
  }
  
  try {
    const res = await fetch(`http://${ip}/rpc/Shelly.CheckForUpdate`);
    const data = await res.json();
    // console.log({"gen2":data})
    return {"gen2":data}
  } catch (error) {
    retObj = {"gen2":{"stable":false, "error":true}}
    // console.error(ip, "ERROR checkForUpdate - FETCH GEN 2")
  }
  if(!retObj.error)
    return {"error":'Device might be asleep or disconnected from power',"ip":ip}
  else
    return retObj

}

// provisioning
export const addDiscoveredDevices = async (ssid,pass,prefix,mqttServer,mqttPassword) => {  
  const x = provisionDevice(ssid,pass,prefix,mqttServer,mqttPassword)
  return x
}


// MQTT functions

export async function subscribeToAllDevices () {
  // get all devices from DB
  // get the mqttServer 
  // get the mqttClientId
  // subscribe to topics
  

}