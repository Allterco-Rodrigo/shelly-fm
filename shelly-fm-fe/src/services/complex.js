import { getClient } from "./client";

export const getComplexes = async () => {
  const client = getClient();
  const { data } = await client.get(`/complex/all`);
  return data;
};

export const getComplexById = async (id) => {
  const client = getClient();
  const { data } = await client.get(`/complex/${id}`);
  return data;
};

export const addComplex = async (complex) => {
  const client = getClient();
  const { data } = await client.post(`/complex`, complex);
  return data;
};

export const updComplex = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/complex/update/${id}`, updObj);
  return data;
};

export const delComplex = async (id, updObj) => {
  const client = getClient();
  const { data } = await client.patch(`/complex/delete/${id}`, updObj);
  return data;
};