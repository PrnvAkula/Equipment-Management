import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form';
import Alerts from '../components/Alerts';

function RegisterUser() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit =  async (event) => {
        event.preventDefault();

        
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', { userid, password, designation});
            console.log('Response:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            const message = error.response?.data?.error || 'Facing an unkown error';
            setError(message);
        }
        
    };

    return (
        <div className='mainContainer'>
            <header className='header'>Registration for Equipment Booking</header>
            {error && <Alerts error = {error}/>}
            <div className='designation'>
                <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
                    <option value="">Select Designation</option>
                    <option value="staff">Staff</option>
                    <option value="doctor">Doctor</option>
                </select>
            </div>
            <Form userid={userid}
            password={password} 
            setuserid={setUserid} 
            setpassword={setPassword} 
            handleSubmit={handleSubmit} 
            buttoner={"Sign In"}
            register = {'T'} />
        </div>
    );
}

export default RegisterUser;