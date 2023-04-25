import { MongoClient } from "mongodb";
import { MONGO_PRD, MONGO_DEV } from "../secrets.js";

export const getDb = async () => {
  // const client = new MongoClient(MONGO_PRD); //docker
const client = new MongoClient(MONGO_DEV); //localhost - DEVELOPMENT

  await client.connect();
  // return client.db("shelly-fm-db");
  return client.db("shelly-dcc");

};

export const getTestMongo = async () => {
  const db = await getDb();
  const cursor = db.listCollections();
  const res = cursor.forEach((collection) => {
    console.log(collection.name);
  })
  
  return "connected"
}

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
