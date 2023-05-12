import { MongoClient } from "mongodb";
import { MONGO } from "../config.js";

export const getDb = async () => {
  const client = new MongoClient(MONGO);

  await client.connect();
  return client.db("shelly-dcc");

};

export const getDeviceCurrentDataCollection = async () => {
  const db = await getDb();
  return db.collection("devicesCurrentData");
};

export const getDeviceMqttDataCollection = async () => {
  const db = await getDb();
  return db.collection("devicesMqttData");
};

export const getDeviceHistoricDataCollection = async () => {
  const db = await getDb();
  return db.collection("devicesHistoricData");
};

export const getLocationCollection = async () => {
  const db = await getDb();
  return db.collection("locations");
};

export const getUnitFloorPlanCollection = async () => {
  const db = await getDb();
  return db.collection("unitFloorPlan");
};

export const getDeviceGetStatusCollection = async () => {
  const db = await getDb();
  return db.collection("devicesGetStatus");
};

export const getDeviceGetConfigCollection = async () => {
  const db = await getDb();
  return db.collection("devicesGetConfig");
};

export const getDevicesMqttDataCollection = async () => {
  const db = await getDb();
  return db.collection("devicesMqttData");   
}

export const getMqttStatus = async () => {
  const db = await getDb();
  return db.collection("devicesMqttData");   
}

