import TabsExample from '../components/Nav';
import { useEffect, useState } from 'react';
import DeleteTable from '../components/DeleteTable';
import Alerts from '../components/Alerts';
import useAuth from '../Util/Context';



function DeleteBooking(){


    const [data, setData] = useState([]);
    const {auth} = useAuth();
    const [error, setError] = useState('');
    const userId = auth.user;
    
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/data/${userId}`,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
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
        <TabsExample op1={'View Bookings'} op2={'Statistical Data'} op3= {'Manage Equipment'} op4= {'Edit Bookings'} op1href={'/staffhome'} op2href={'/stats'} op3href={'/manageequipment'} op4href={'/deletebooking'} />
        <DeleteTable data = {data} errorr ={error} afterDelete = {afterDelete}/>
        {error && <Alerts error = {error}/>}
        

        </>
    )
}

export default DeleteBooking;