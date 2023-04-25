import { getClient } from "./client";

const client = getClient();

export const getMqttStatus = async () => {
  const {data} = await client.get("/mqtt/status");
  return data
};

export const getDevicesMqttConfig = async () => {
    const {data} = await client.get("/mqtt/config");
    return data
  };

export const getMqttSubscribe = async (arrObj) => {
    // receives an array of objects
    arrObj.forEach((obj) => {
      const {data} = client.patch("/mqtt/subscribe",obj);
      return data
    });    
  };