import { getClient } from "./client";

export const getBuildings = async () => {
  const client = getClient();
  const { data } = await client.get(`/building/all`);
  return data;
};

export const getBuildingById = async (id) => {
  const client = getClient();
  const { data } = await client.get(`/building/${id}`);
  return data;
};

export const addBuilding = async (building) => {
  const client = getClient();
  const { data } = await client.post(`/building`, building);
  return data;
};

export const updBuilding = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/building/update/${id}`, updObj);
  return data;
};

export const delBuilding = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/building/delete/${id}`, updObj);
  return data;
};