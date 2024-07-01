import TabsExample from "../components/Nav";
// import { decode as base64_decode } from 'base-64';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alerts, {Success} from '../components/Alerts';


function ManageEquipment() {
    const [newEquipment, setNewEquipment] = useState('');
    const [equipments, setEquipments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const username = base64_decode(sessionStorage.getItem('authToken'));
    
    useEffect(() => {
        fetch('http://127.0.0.1:5000/equipment')
          .then(response => response.json())
          .then(data => setEquipments(data))
          .catch(error => console.log('Error fetching data:', error));
      }, []);
 
    const handleDelete = async(id) =>{
        const isConfirmed = window.confirm("Are you sure you want to delete this equipment?");
        if (isConfirmed) {
            
        try {
            const response = await fetch(`http://127.0.0.1:5000/deleteequipment/${id}`, { method: 'DELETE' });
            const data = await response.json(); // Assuming the server sends back JSON data
            
            setEquipments(equipments.filter(equipment => equipment.id !== id));
            setSuccess(data.message) 
            setError('');
          } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setError(error.response?.data?.error || 'Facing an unkown error');
            setSuccess('');
          }
        }else {
            // If the user clicks "Cancel", you can optionally handle it here
            console.log("Delete operation was canceled by the user.");
        }
    }
    const handleAdd = async() =>{
        try {
            console.log('Adding equipment:', newEquipment);
            const response = await axios.post('http://127.0.0.1:5000/addequipment', {newEquipment});
            console.log('Response:', response.data);
            const message = response.data.message || 'Equipment added successfully';
            setSuccess(message);
            setError('');
            setNewEquipment('');
            setEquipments([...equipments, {id: response.data.id, equipment: newEquipment}]);
        } catch (error) {
            console.error('Error:', error);
            const message = error.response?.data?.error || 'Facing an unkown error';
            setError(message);
            setSuccess('');
    }
}
    return (
        <>
            <TabsExample op1={'View Bookings'}
                op2={'Manage Equipment'}
                op1href={'/staffhome'}
                op2href={'/manageequipment'} />
            {error && <Alerts error = {error}/>}
            {success && Success({success : success})}
        <div className='addequipment'>
            <input type="text" value={newEquipment} onChange={e => setNewEquipment(e.target.value)} />
            <Button onClick={handleAdd} className='but'>Add</Button>
        </div>
            <div>
            <table className="table table-striped">
                <thead>
                    <tr>              
                        <th scope="col">#</th>
                        <th scope="col">Equipment</th>          
                    </tr>
                </thead>
                <tbody>
                {equipments.map((equipment,index) => (
                    <tr key={index}>
                         <th scope="row">{index+1}</th>
                        <td>{equipment.equipment}</td>
                        <td>
                            <Button onClick={() => handleDelete(equipment.id)} className='but'>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        

        </>
    );

}

export default ManageEquipment;