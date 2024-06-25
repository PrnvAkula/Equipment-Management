import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useState } from 'react';
import Table from '../components/Table';

function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Header />
      <Table data = {data}/>
    </div>
  );
}

export default HomePage;
