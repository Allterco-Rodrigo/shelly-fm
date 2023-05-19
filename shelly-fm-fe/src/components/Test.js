import React, { useEffect, useState } from 'react';
import { getTest } from '../services/test';

export default function Test() {
  
  const [data, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        setData(await getTest())
      } catch (e) {
        setData(e)
      }
    }
    fetchData();
  },[])

  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
}

