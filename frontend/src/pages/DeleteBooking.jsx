import TabsExample from '../components/Nav';
import { useEffect, useState } from 'react';
import {decode as base64_decode} from 'base-64';
import DeleteTable from '../components/DeleteTable';
import Alerts from '../components/Alerts';


function DeleteBooking(){
    const [data, setData] = useState([]);
    const user = sessionStorage.getItem('authToken')
    const username = base64_decode(user);
    const userId = username;
    const [error, setError] = useState('');

    
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/data/${userId}`)
          .then(response => response.json())
            
          .then(data => {setData(data)
            setError(data.message)
          })
          .catch(error => console.error('Error:', error));
      }, [userId]);

      function afterDelete(id){
        setData(data.filter(booking => booking.id !== id));
      }

    return (
        <>
        <TabsExample op1 = {'Book Equipment'} 
            op2= {'Delete Booking'}
            op1href = {'/doctorhome'}
            op2href = {'/deletebooking'} />
        {error && <Alerts error = {error}/>}
        <DeleteTable data = {data} errorr ={error} afterDelete = {afterDelete}/>
        

        </>
    )
}

export default DeleteBooking;