// import React, { useEffect } from 'react'
// import { useState } from 'react';
// import Table from '../components/Table';
// import TabsExample from '../components/Nav';
// // import { decode as base64_decode } from 'base-64';
// import Alerts from '../components/Alerts';


// function StaffHome() {
//   // const username = base64_decode(sessionStorage.getItem('authToken'));


//   const [equipments, setEquipments] = useState([]);
//   const [error, setError] = useState('');


//   const [data, setData] = useState([]);
//   const [sorter, setSorter] = useState('');
//   const [sortBy, setSortBy] = useState('Date');

//   const handleSortChange = (event) => {
//     setSortBy(event.target.value);
//     setSorter('');
//   }
//   const handleBranchChange = (event) => {
//     setSorter(event.target.value);
//   }
//   const handleEnameChange = (event) => {
//     setSorter(event.target.value);
//   }
//   const handleDate = (event) => {
//     setSorter(event.target.value);
//   }
//   useEffect(() => {
//     fetch('http://127.0.0.1:5000/data',{
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         setData(data)
//         setError(data.message)
//       })
//       .catch(error => console.log('Error fetching data:', error));
//     fetch('http://127.0.0.1:5000/equipment',{
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         setEquipments(data)
//       })
//       .catch(error => console.log('Error fetching data:', error));
//   }, []);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:5000/Sortby?sort_by=${sortBy}&sort=${sorter}`,{
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         setData(data)
//         console.log(data.message)
//         setError(data.message)
//       })
//       .catch(error => console.error('Error fetching inventory:', error));
//   }, [sortBy, sorter]);


//   return (
//     <>
//       <div>
//         <TabsExample op1={'View Bookings'}
//           op2={'Manage Equipment'}
//           op1href={'/staffhome'}
//           op2href={'/manageequipment'} />
//       </div>
//       <div className='viewequipment'>
//         Sort by:
//         <select onChange={handleSortChange} value={sortBy}>

//           <option value="Date">Date</option>
//           <option value="Branch">Branch</option>
//           <option value="Equipment">Equipment</option>
//         </select>
//         Add Filter: {sortBy === 'Date' && <input type="date" onChange={handleDate} value={sorter} />}
//         {sortBy === 'Branch' && <select onChange={handleBranchChange} value={sorter}>
//           <option value="">Select Branch</option>
//           <option value="Malakpet">Malakpet</option>
//           <option value="Secunderabad">Secunderabad</option>
//           <option value="Somajiguda">Somajiguda</option>
//         </select>}

//         {sortBy === 'Equipment' && <select onChange={handleEnameChange} value={sorter}>
//           <option value="">Select Equipment</option>
//           {equipments.map((equipment, index) => (
//             <option key={index} value={equipment.equipment}>{equipment.equipment}</option>
//           ))}
//         </select>}

//       </div>
//       <div>
//       {error && <Alerts error={error} />}
//       {!error && <Table data={data} />}
//       </div>
//     </>

//   );
// }

// export default StaffHome;

import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import TabsExample from '../components/Nav';
import Alerts from '../components/Alerts';

function StaffHome() {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [sorter, setSorter] = useState('');
  const [sortBy, setSortBy] = useState('Date');

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setSorter('');
  };

  const handleBranchChange = (event) => {
    setSorter(event.target.value);
  };

  const handleEnameChange = (event) => {
    setSorter(event.target.value);
  };

  const handleDate = (event) => {
    setSorter(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/data', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        setError(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }

      try {
        const equipmentResponse = await fetch('http://127.0.0.1:5000/equipment', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!equipmentResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const equipmentData = await equipmentResponse.json();
        setEquipments(equipmentData);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        // Update error handling if needed
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSortedData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/Sortby?sort_by=${sortBy}&sort=${sorter}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const sortedData = await response.json();
        setData(sortedData);
        setError(sortedData.message);
      } catch (error) {
        console.error('Error fetching sorted data:', error);
        setError('No Bookings Found');
      }
    };

    fetchSortedData();
  }, [sortBy, sorter]);

  return (
    <>
      <TabsExample op1={'View Bookings'} op2={'Manage Equipment'} op1href={'/staffhome'} op2href={'/manageequipment'} />
      <div className='viewequipment'>
        Sort by:
        <select onChange={handleSortChange} value={sortBy}>
          <option value="Date">Date</option>
          <option value="Branch">Branch</option>
          <option value="Equipment">Equipment</option>
        </select>
        Add Filter: 
        {sortBy === 'Date' && <input type="date" onChange={handleDate} value={sorter} />}
        {sortBy === 'Branch' && (
          <select onChange={handleBranchChange} value={sorter}>
            <option value="">Select Branch</option>
            <option value="Malakpet">Malakpet</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Somajiguda">Somajiguda</option>
          </select>
        )}
        {sortBy === 'Equipment' && (
          <select onChange={handleEnameChange} value={sorter}>
            <option value="">Select Equipment</option>
            {equipments.map((equipment) => (
              <option key={equipment.id} value={equipment.equipment}>{equipment.equipment}</option>
            ))}
          </select>
        )}
      </div>
      <div>
        {error && <Alerts error={error} />}
        {!error && <Table data={data} />}
      </div>
    </>
  );
}

export default StaffHome;