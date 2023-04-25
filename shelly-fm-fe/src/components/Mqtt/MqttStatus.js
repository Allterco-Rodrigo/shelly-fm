import { Col, Layout, Row, Select, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getDevicesMqttConfig, getMqttStatus, getMqttSubscribe } from "../../services/mqtt.js";
import { delay } from "../../services/supportFunctions.js";
import { getConnectedDevices } from "../../services/device.js";

const { Title } = Typography;
const { Content } = Layout;

export default function MqttStatus() {  
  const navigate = useNavigate();
  const [mqttStatus, setMqttStatus] = useState(false);

  // get list of devices with their MQTT settings 
  useEffect(() => {

    const fetchDevices = async () => {
      getConnectedDevices()
      .then(devices => {
        let arrObj = []
        devices.map((dev) => {
          if(dev.mqttServer !== null){
            let topic = ''
            dev.gen === 1
            ? topic = "shellies/" + dev.mqttClientId.toString() + "/relay/0/power"
            : topic = dev.mqttClientId.toString() + "/events/rpc"
            arrObj.push({"ip":dev.ip, "server":dev.mqttServer, "topic":topic}) 
          }
        })
        return arrObj
      })
      .then(arr => {
        // console.log(arr)
        getMqttSubscribe(arr)
      })
      // .then(
      //     getMqttStatusData()
      //       .then(ret => {
      //         console.log(ret)
      //       })
      // )
      .catch(()=>{
        console.log("Error Subscribing to Topic")
      })
    }
    fetchDevices()
  },[]);

  // return data from database
  
  const getMqttStatusData = async () => {
    console.log("Returned Data")
    const res = await getMqttStatus()
    setMqttStatus(res)
  }

  // const handleChange = async (value) => {
  //   const data = await getDeviceById(value)
  //   setDeviceId(value)
  //   setDeviceIp(data.ip)
  //   setDeviceGen(data.gen)
  //   setDeviceName(data.name?data.name:"")
  //   setWifi(data.wifi?data.wifi:"")
  //   setMqttServer(data.mqttServer?data.mqttServer:"")
  //   setValue(value) 
  //   setShow(true)
  // };

  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
            <Typography>{mqttStatus}</Typography>
          </Space>
      </Content>
    </Layout>
  );
}
