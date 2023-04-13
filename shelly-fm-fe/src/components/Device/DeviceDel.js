import { Col, Layout, Row, Select, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { delDeviceById, getConnectedDevices, getDeviceById } from "../../services/device";
import { Button, TextField } from "@mui/material";

const { Title } = Typography;
const { Content } = Layout;

export default function DeviceUpd() {  

  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState();
  const [deviceIp, setDeviceIp] = useState();
  const [deviceGen, setDeviceGen] = useState('');
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getConnectedDevices();
      setDevices(devices);
    };
    fetchDevices();
  }, []);
  
  const handleChange = async (value) => {
    const data = await getDeviceById(value)
    setDeviceId(value)
    setDeviceIp(data.ip)
    setDeviceGen(data.gen)
    setValue(value) 
    setShow(true)
  };

  async function handleDelete() {
    let obj = {
      "deviceIp":deviceIp,
      "deviceGen":deviceGen,
      "reason":reason,
    }
    const x = await delDeviceById(deviceId,obj)
  }
  
  return (
    <Layout>
        <Content style={{ margin: "20px 16px" }}>
          <Space direction="vertical">
          <Title level={2}>Remove and Factory Reset Device</Title>

          <Select
            name="deviceList"
            placeholder="Select Device"
            value={value}
            onChange={handleChange}
            style={{ minWidth: "400px" }}
            >
            {!devices ? (
                <Select.Option value={0}>Loading Devices</Select.Option>
            ) : (
                devices.map((device) => (
                <Select.Option key={device?._id} value={device?._id}>
                    {device?.name + " - " + device?.ip}
                </Select.Option>
                ))
            )}
          </Select>
          { show 
          ?(<>
            <Row>
              <Col>
                <Typography variant="h8"  component="span">
                  Here you can remove a device from the list <br />
                  and factory reset in case the device is in the network
                </Typography>
              </Col>
            </Row><Row>
              <Space>
                <Col>
                  <TextField
                    label="Reason"
                    onChange={(e) => setReason(e.target.value)}
                    margin="normal"
                    variant="filled"
                    size="small"
                  />
                </Col>
                <Col>
                  <Button variant="contained" color="primary" onClick={handleDelete}>
                    Remove Device
                  </Button>
                </Col>
              </Space>
            </Row>
            </>
          ):("")
          }
        </Space>
    </Content>
  </Layout>
);
}
