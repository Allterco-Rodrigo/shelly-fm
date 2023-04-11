import { getClient } from "./client";

const client = getClient();

export const getTest = async () => {
    const data = await client.get('/test')
    return JSON.stringify(data)
  }