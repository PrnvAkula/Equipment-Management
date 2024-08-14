import React, { useEffect } from 'react';
import TabsExample from '../components/Nav';
import { useState } from 'react';
import Alerts from '../components/Alerts';

export default function Stats() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
      };
    useEffect(() => {
        if(sortBy !== ''){
        const fetchData = async () => {
            try {
              const response = await fetch(`http://127.0.0.1:5000/datacount/${sortBy}?from_date=${fromDate}&to_date=${toDate}`);
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
        }
        fetchData();
    }
    }, [sortBy, fromDate, toDate]);
  return (
    <div>
        <TabsExample op1={'View Bookings'} op2={'Statistical Data'} op3= {'Manage Equipment'} op4= {'Edit Bookings'} op1href={'/staffhome'} op2href={'/stats'} op3href={'/manageequipment'} op4href={'/deletebooking'} />
        {error && <Alerts error={error} />}
        <div className='viewequipment'>
        Sort by:
        <select onChange={handleSortChange} value={sortBy}>
            <option value="">Select Branch</option>
            <option value="Malakpet">Malakpet</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Somajiguda">Somajiguda</option>
            <option value="HitecCity">Hitec City</option>
        </select>
        <label>
                    From Date:
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </label>
                <label>
                    To Date:
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </label>
        </div>

        {sortBy && !error && <table className="table table-striped">
                <thead>
                    <tr>     
                        <th scope="col">Equipment</th>
                        <th scope="col">Bookings</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {/* <th scope="row">{index+1}</th> */}
                        <td>{row.equipment_name}</td>
                        <td>{row.booking_count}</td>
                    </tr>
                ))} 
                </tbody>
            </table>
        }
        
        
       
    </div>
  );
}