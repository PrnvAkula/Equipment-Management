import React, { useState } from 'react';
import Form from '../components/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [userid, setuserid] = useState('');
    const [password, setpassword] = useState('');
    // const [designation, setDesignation] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://127.0.0.1:5000/login', { userid, password })
            .then(response => {
                console.log('Login successful', response.data);
                navigate('/home');
            })
            .catch(error => {
                console.error('Login failed', error.response.data);
                setLoginError('Login failed: Incorrect userid, password, or designation');
            });
    }

    return (
        <div className='main'>
            <div className='mainContainer'>
                <header className='header'>Equipment Booking Portal</header>
                {loginError && <div className="error">{loginError}</div>}
                {/* <div>
                    <label>Designation:</label>
                    <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
                        <option value="Doctor">Doctor</option>
                        <option value="Staff">Staff</option>
                    </select>
                </div> */}
                <Form userid={userid}
                    password={password}
                    setuserid={setuserid}
                    setpassword={setpassword}
                    handleSubmit={handleSubmit}
                    buttoner={"Log In"} />
            </div>
        </div>
    );
}

export default LoginPage;