import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form';

function RegisterUser() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const navigate = useNavigate();


    const handleSubmit =  async (event) => {
        event.preventDefault();

        if (!designation) {
            Error('Invalid designation selected');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', { userid, password, designation});
            console.log('Response:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            
        }
        // axios.post('http://localhost:5000/register', JSON.stringify({ userid, password, designation: mappedDesignation })
        //     .then(response => {
        //         console.log('Registration successful', response.data);
        //         navigate('/login');
        //     })
        //     .catch(error => {
        //         Error('Registration failed', error.response.data);
        //         // Optionally, inform the user that registration has failed
        //     });
        // );
    };

    return (
        <div className='mainContainer'>
            <header className='header'>Registration for Equipment Booking</header>
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