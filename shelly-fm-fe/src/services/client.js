import axios from "axios";

export const getClient = () => {
  return axios.create({
    // this is the address where the api is running
    // baseURL: "https://shelly-dcc-be.web.app",
    baseURL: "http://localhost:5050",
  });
};
