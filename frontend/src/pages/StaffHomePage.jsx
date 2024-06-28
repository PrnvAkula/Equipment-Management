import React, { useEffect } from 'react'
import { useState } from 'react';
import Table from '../components/Table';
import TabsExample from '../components/Nav';
import { decode as base64_decode } from 'base-64';
import Alerts from '../components/Alerts';

function StaffHome() {
  const [data, setData] = useState([]);
  const username = base64_decode(sessionStorage.getItem('authToken'));
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => {setData(data)
        setError(data.message)
      })
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  return (
    <div>
      <TabsExample op1 = {'View Bookings'}
      op2 = {'Manage Equipment'}
      op1href = {'/staffhome'}
      op2href = {'/manageequipment'} />
      {error && <Alerts error = {error}/>}

      Welcome, {username}!
      <Table data = {data}/>
    </div>
  );
}

export default StaffHome;
