import { getClient } from "./client";

const client = getClient();

export const getConnectedDevices = async () => {
  const {data} = await client.get("/list");
  return data
};

export const refreshDevicesData = async () => {
  const {data} = await client.get("/list/refresh");
  return data
}; 

export const patchConnectedDevices = async () => {
  const {data} = await client.get("/list/reload");
    return data
};

export const addDiscoveredDevices = async (ssid,pass,prefix) => {
  const data = await client.post("/device/add",{"ssid":ssid,"pass":pass,"prefix":prefix});
  return data
}

export const refreshPage = async () => {
  const data = await client.get("/refresh")
  return data
}