import TabsExample from '../components/Nav';
import { useEffect, useState } from 'react';
import {decode as base64_decode} from 'base-64';
import DeleteTable from '../components/DeleteTable';
import Alerts from '../components/Alerts';




function DeleteBooking(){


    const [data, setData] = useState([]);
    const user1 = sessionStorage.getItem('authToken')
    const username = base64_decode(user1);
    const userId = username;
    const [error, setError] = useState('');

    
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/data/${userId}`)
          .then(response => response.json())
          .then(data => {setData(data)
            setError(data.message)
          })
          .catch(error => console.error('Error:', error));
        // fetch(`http://127.0.0.1:5000/login/${userId}`)
        //   .then(response => {
        //     console.log(response.data.designation)
        //     if(response.data.designation !== 'doctor'){
        //         window.location.href = '/staffhome';
        //     }
            
        // })
        // .catch(error => {
        //     console.error('Login failed', error.response.data);
        // });
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
        <DeleteTable data = {data} errorr ={error} afterDelete = {afterDelete}/>
        {error && <Alerts error = {error}/>}
        

        </>
    )
}

export default DeleteBooking;