import React, { useEffect } from 'react'
import { useState } from 'react';
import Table from '../components/Table';
import TabsExample from '../components/Nav';

function StaffHome() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  return (
    <div>
      <TabsExample />
      <Table data = {data}/>
    </div>
  );
}

export default StaffHome;
