import { getClient } from "./client";

export const getUnits = async () => {
  const client = getClient();
  const { data } = await client.get(`/unit/all`);
  return data;
};

export const getUnitById = async (id) => {
  const client = getClient();
  const { data } = await client.get(`/unit/${id}`);
  return data;
};

export const addUnit = async (unit) => {
  const client = getClient();
  const { data } = await client.post(`/unit`, unit);
  return data;
};

export const updUnit = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/unit/update/${id}`, updObj);
  return data;
};

export const delUnit = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/unit/delete/${id}`, updObj);
  return data;
};