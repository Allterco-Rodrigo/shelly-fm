import { getClient } from "./client";

export const getRooms = async () => {
  const client = getClient();
  const { data } = await client.get(`/room/all`);
  return data;
};

export const getRoomById = async (id) => {
  const client = getClient();
  const { data } = await client.get(`/room/${id}`);
  return data;
};

export const addRoom = async (room) => {
  const client = getClient();
  const { data } = await client.post(`/room`, room);
  return data;
};

export const updRoom = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/room/update/${id}`, updObj);
  return data;
};

export const delRoom = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/room/delete/${id}`, updObj);
  return data;
};