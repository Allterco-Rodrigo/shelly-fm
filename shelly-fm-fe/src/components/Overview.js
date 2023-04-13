import { Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { currentTotalEnergyData, totalEnergyMonth } from '../services/overview.js';

export default function Overview() {
  
  const [data, setData] = useState([0,0]);
  const [pastData, setPastData] = useState([0,0,0,0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ret1 = await currentTotalEnergyData()        
        setData(ret1)
      } catch (e) {
        console.log("Error Overview Fetch 1",e)
      }
    }
    fetchData();
  },[])

  useEffect(() => {
    async function fetchData() {
      try {
        const ret2 = await totalEnergyMonth()        
        setPastData(ret2)
      } catch (e) {
        console.log("Error Overview Fetch 2",e)
      }
    }
    fetchData();
  },[])

  return (<>
    <div>
      <h1>Current Day - Total Energy Consumed</h1>
      <Statistic title="Kw/h" value={data[0].totalEnergy/1000} precision={3}></Statistic>
    </div>
    <div>
      <h1>Current Month - Total Energy Consumed</h1>
      <Statistic title="Kw/h" value={pastData[0].totalEnergy/1000} precision={3}></Statistic>
    </div>
    {/* <div>
      <h1>Previous Month Predicted Cost</h1>
      <h4>{pastData[1].previousTotalEnergy/1000 * 0.12} Kw/h</h4>
    </div>
    <div>
      <h1>Previous Month Predicted Total Energy Consumed</h1>
      <h4>{pastData[1].previousTotalEnergy/1000} Kw/h</h4>
    </div> */}
  </>);
}

