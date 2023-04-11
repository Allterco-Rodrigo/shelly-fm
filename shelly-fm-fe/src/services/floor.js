import { getClient } from "./client";

export const getFloors = async () => {
  const client = getClient();
  const { data } = await client.get(`/floor/all`);
  return data;
};

export const getFloorById = async (id) => {
  const client = getClient();
  const { data } = await client.get(`/floor/${id}`);
  return data;
};

export const addFloor = async (floor) => {
  const client = getClient();
  const { data } = await client.post(`/floor`, floor);
  return data;
};

export const updFloor = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/floor/update/${id}`, updObj);
  return data;
};

export const delFloor = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/floor/delete/${id}`, updObj);
  return data;
};