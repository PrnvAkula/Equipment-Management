import React, { useState } from 'react';
import Form from '../components/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [userid, setuserid] = useState('');
    const [password, setpassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://127.0.0.1:5000/login', { userid, password })
            .then(response => {
                console.log('Login successful', response.data);
                setuserid(response.data.username);
                
                if (response.data.designation === 'doctor')
                    navigate('/addequipment',{state : { username: userid }});
                    // navigate('/addequipment')

                else
                    navigate('/home')

            
            })
            .catch(error => {
                console.error('Login failed', error.response.data);
                setLoginError('Login failed: Incorrect userid or password. Please try again.');
            });
    }

    return (
        <div className='main'>
            <div className='mainContainer'>
                <header className='header'>Equipment Booking Portal</header>
                {loginError && <div className="error">{loginError}</div>}
                <Form userid={userid}
                    password={password}
                    setuserid={setuserid}
                    setpassword={setpassword}
                    handleSubmit={handleSubmit}
                    buttoner={"Log In"} 
                    login = {"T"}/>
            </div>
        </div>
    );
}

export default LoginPage;