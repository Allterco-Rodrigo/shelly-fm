import { Col, Layout, Row, Select, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedDevices, updDiscoveredDevices } from "../../services/device";
import { Button, TextField } from "@mui/material";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default function DeviceUpd() {  

  const [cnt, setCnt] = useState(0);
  const [cntErr, setCntErr] = useState(0);
  const [show, setShow] = useState(false);

  const [deviceName, setDeviceName] = useState('');

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const [mqttServer, setMqttServer] = useState('');
  const [mqttPassword, setMqttPassword] = useState('');
  
  const [devices, setDevices] = useState([]);
  
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getConnectedDevices();
      setDevices(devices);
    };
    fetchDevices();
  }, []);
  
  const handleDeviceSelect = (value) => {
    console.log(value); // or do whatever you need to do with the selected device key
  };

  async function handleClick() {  
    setShow(!show)
    const x = await updDiscoveredDevices(deviceName,ssid,password,mqttServer,mqttPassword)
    setCnt(x.data.cnt)
    setCntErr(x.data.cntErr)
  }
  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
          <Title level={2}>Update Name / Devices Wi-Fi / MQTT</Title>

          <Select placeholder="Select a device" value={devices} style={{ width: 120 }} onChange={handleDeviceSelect}>
            {devices.map((device) => (
              <Option value={device}>{device.name}</Option>
            ))}
          </Select>

          <Row>
            <Col>
              <Typography variant="h8"  component="span">
                Here you can change the name of a device
              </Typography>
            </Col>
          </Row><Row>
            <Col>
              <TextField
                label="Device Name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                margin="normal"
                variant="filled"
                size="small"
              />
            </Col>
          </Row><Row>
            <Col>
              <Typography variant="h8"  component="span">
                Here you change the current credentials necessary to connect to a Wi-Fi router
              </Typography>
            </Col>
          </Row><Row>
            <Space>
            <Col>
              <TextField
                label="SSID"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                margin="normal"
                variant="filled"
                size="small"
              />
            </Col><Col>
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="filled"
                size="small"
                type="password"
              />
            </Col>
            </Space>
          </Row><Row>
            <Col>
              <Typography variant="h8"  component="span">
                Here you change the current credentials necessary to connect to a MQTT server
              </Typography>
            </Col>
          </Row><Row>
            <Space>
            <Col>
              <TextField
                label="MQTT Server Address"
                value={mqttServer}
                onChange={(e) => setMqttServer(e.target.value)}
                margin="normal"
                variant="filled"
                size="small"
                />
            </Col><Col>
              <TextField
                label="Password"
                value={mqttPassword}
                onChange={(e) => setMqttPassword(e.target.value)}
                margin="normal"
                variant="filled"
                size="small"
                type="password"
              />
            </Col>
            </Space>
          </Row><Row>
            <Col>
              <Button variant="contained" color="primary" onClick={handleClick}>
                Update devices
              </Button>
            </Col>
          </Row>
          {
            show
            ?
              (cnt < 1)
              ? (<Title level={4}><Space size={"large"}>Updating devices<Spin /></Space></Title>)
              : (<Title level={4}>{cnt} Device(s) provisioned<br/>{cntErr} Device(s) not provisioned</Title>)
            : ("")
          }          
        </Space>
    </Content>
  </Layout>
);
}
