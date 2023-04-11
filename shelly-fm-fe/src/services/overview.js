import { getClient } from "./client";

const client = getClient();

export const currentTotalEnergyData = async () => {
    const {data} = await client.get('/overview/currenttotalenergydata')
    if(data.length > 0){
      // console.log("current",data)
      return data
    } else {
      return [{totalEnergy : 0}]
    }
  }

export const totalEnergyMonth = async () => {
    const {data} = await client.get('/overview/totalenergymonth')
    if(data.length > 0){
      // console.log("cumulative",data)
      return data
    } else {
      return [{totalEnergy : 0}]
    }
  }