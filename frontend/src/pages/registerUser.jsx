import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterUser() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const navigate = useNavigate();

    
    const designationMapping = {
        "1": "Staff",
        "2": "Doctor",
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        
        const mappedDesignation = designationMapping[designation];

        if (!mappedDesignation) {
            console.error('Invalid designation selected');
            return;
        }

        axios.post('http://127.0.0.1:5000/register', JSON.stringify({ userid, password, designation: mappedDesignation }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('Registration successful', response.data);
                navigate('/login');
            })
            .catch(error => {
                console.error('Registration failed', error.response.data);
                // Optionally, inform the user that registration has failed
            });
    };

    return (
        <div className='mainContainer'>
            <header className='header'>Register for Equipment Booking Portal</header>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID:</label>
                    <input
                        type="text"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Designation:</label>
                    <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
                        <option value="">Select Designation</option>
                        <option value="1">Staff</option>
                        <option value="2">Doctor</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterUser;