import { Layout, Space, Spin, Typography } from "antd";
import React, { useState } from "react";
import { addDiscoveredDevices } from "../../services/device";
import { Button, TextField } from "@mui/material";

const { Title } = Typography;
const { Content } = Layout;

export default function DeviceAdd() {  

  const [cnt, setCnt] = useState(0);
  const [cntErr, setCntErr] = useState(0);
  const [show, setShow] = useState(false);

  const [prefix, setPrefix] = useState('shelly');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const [mqttServer, setMqttServer] = useState('');
  const [mqttPassword, setMqttPassword] = useState('');

  async function handleClick() {  
    setShow(!show)
    const x = await addDiscoveredDevices(ssid,password,prefix,mqttServer,mqttPassword)
    setCnt(x.data.cnt)
    setCntErr(x.data.cntErr)
  }

  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
            <Title level={2}>Provision Devices</Title>
            <Typography variant="h8" noWrap component="span">
              Here you set the credentials necessary for all <br /> 
              broadcasting devices connect to the network
            </Typography>
            <TextField
            label="PREFIX"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            margin="normal"
            variant="filled"
            size="small"
          />            
            <TextField
            label="SSID"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            margin="normal"
            variant="filled"
            size="small"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="filled"
            size="small"
            type="password"
          />

          <Typography variant="h8" noWrap component="span">
              Here you set the credentials necessary for all <br /> 
              broadcasting devices connect to a MQTT server
            </Typography>
            <TextField
            label="MQTT Server Address"
            value={mqttServer}
            onChange={(e) => setMqttServer(e.target.value)}
            margin="normal"
            variant="filled"
            size="small"
          />
          <TextField
            label="Password"
            value={mqttPassword}
            onChange={(e) => setMqttPassword(e.target.value)}
            margin="normal"
            variant="filled"
            size="small"
            type="password"
          />           
          <Button variant="contained" color="primary" onClick={handleClick}>
            Search and provision devices
          </Button>
          {
            show
            ?
              (cnt < 1)
              ? (<Title level={4}><Space size={"large"}>Searching for Shelly devices<Spin /></Space></Title>)
              : (<Title level={4}>{cnt} Device(s) provisioned<br/>{cntErr} Device(s) not provisioned</Title>)
            : ("")
          }          
        </Space>
    </Content>
  </Layout>
);
}
