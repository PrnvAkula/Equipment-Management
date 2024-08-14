import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import TabsExample from '../components/Nav';
import Alerts from '../components/Alerts';
import useAuth  from '../Util/Context';

function StaffHome() {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [sorter, setSorter] = useState('');
  const [sortBy, setSortBy] = useState('Active');
  const { auth } = useAuth();

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
        const response = await fetch(`http://127.0.0.1:5000/Sortby?sort_by=${sortBy}&sort=${sorter}`);
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
      {auth.roles === 'admin' && <TabsExample op1={'View Bookings'} op2={'Statistical Data'} op3= {'Manage Equipment'} op4= {'Edit Bookings'} op1href={'/staffhome'} op2href={'/stats'} op3href={'/manageequipment'} op4href={'/deletebooking'} />}
      {auth.roles === 'staff' && <TabsExample op1={'View Bookings'} op2={'Book Equipment'} op1href={'/staffhome'} op2href={'/doctorhome'} />}
      <div className='viewequipment'>
        Sort by:
        <select onChange={handleSortChange} value={sortBy}>
          <option value="Active">Active</option>
          <option value="Date">Date</option>
          <option value="Branch">Branch</option>
          <option value="Equipment">Equipment</option>
        </select>
        {sortBy!== 'Active' && 'Filter by:'}
        {sortBy === 'Date' && <input type="date" onChange={handleDate} value={sorter} />}
        {sortBy === 'Branch' && (
          <select onChange={handleBranchChange} value={sorter}>
            <option value="">Select Branch</option>
            <option value="Malakpet">Malakpet</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Somajiguda">Somajiguda</option>
            <option value="HitecCity">Hitec City</option>
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