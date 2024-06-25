import React, { useState } from 'react';
import Form from '../components/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Util/Context';

function LoginPage() {
    const [userid, setuserid] = useState('');
    const [password, setpassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://127.0.0.1:5000/login', { userid, password })
            .then(response => {
                console.log('Login successful', response.data);
                setuserid(response.data.username);
                const authToken = "userToken123";
                sessionStorage.setItem('authToken', authToken);
                auth.login()
                
                if (response.data.designation === 'doctor')
                    navigate('/doctorhome',{state : { username: userid }});
                    // navigate('/addequipment')
                else
                    navigate('/staffhome')

            
            })
            .catch(error => {
                console.error('Login failed', error.response.data);
                setLoginError('Invalid Username or Password.');
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