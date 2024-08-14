import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import TabsExample from "../components/Nav";
import Alerts, { Success } from '../components/Alerts';

function ManageEquipment() {
    const [newEquipment, setNewEquipment] = useState('');
    const [equipments, setEquipments] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/equipment', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setEquipments(data))
        .catch(error => {
            console.error('Error fetching data:', error);
            setError('The equipment list is empty');
        });
    }, []);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this equipment?");
        if (isConfirmed) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/deleteequipment/${id}`, { method: 'DELETE' });
                
                const data = await response.json();
                setEquipments(equipments.filter(equipment => equipment.id !== id));
                setSuccess(data.message);
                setError('');
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                setError('Facing an unknown error during deletion');
                setSuccess('');
            }
        } else {
            console.log("Delete operation was canceled by the user.");
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/addequipment', { newEquipment });
            const message = response.data.message || 'Equipment added successfully';
            setSuccess(message);
            setError('');
            setNewEquipment('');
            setEquipments([...equipments, { id: response.data.id, equipment: newEquipment }]);
        } catch (error) {
            console.error('Error:', error);
            const message = error.response?.data?.error || 'Facing an unknown error';
            setError(message);
            setSuccess('');
        }
    };

    return (
        <>
            <TabsExample op1={'View Bookings'} op2={'Statistical Data'} op3= {'Manage Equipment'} op4= {'Edit Bookings'} op1href={'/staffhome'} op2href={'/stats'} op3href={'/manageequipment'} op4href={'/deletebooking'} />
            {error && <Alerts error={error} />}
            {success && <Success success={success} />}
            <div className='details'>
                <h2>Add an Equipment</h2>
                <input type="text" value={newEquipment} onChange={e => setNewEquipment(e.target.value)} />
                <Button onClick={handleAdd} className='but2'>Add</Button>
            </div>
            <br />
            <br />
            <div className="addeq">
                <h2>Equipment List</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Equipment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipments.map((equipment, index) => (
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