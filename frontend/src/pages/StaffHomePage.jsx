import React, { useEffect } from 'react'
import { useState } from 'react';
import Table from '../components/Table';
import TabsExample from '../components/Nav';
import { decode as base64_decode } from 'base-64';

function StaffHome() {
  const [data, setData] = useState([]);
  const username = base64_decode(sessionStorage.getItem('authToken'));


  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  return (
    <div>
      <TabsExample op1 = {'View Bookings'}
      op2 = {'Manage Equipment'}
      op1href = {'/staffhome'}
      op2href = {'/manageequipment'} />
      Welcome, {username}!
      <Table data = {data}/>
    </div>
  );
}

export default StaffHome;
