import React, { useState } from 'react';
import Form from '../components/Form';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import useAuth  from '../Util/Context';
import Alerts from '../components/Alerts';
// import { encode as base64_encode} from 'base-64'

import  {jwtDecode} from 'jwt-decode';  

function LoginPage() {
    const [userid, setuserid] = useState('');
    const [password, setpassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();



    async function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://127.0.0.1:5000/login', { userid, password })
            .then(response => {
                console.log('Login successful', response.data); 
                setuserid(response.data.username);
                console.log('Access token:', response.data.access_token)
                sessionStorage.setItem('token', response.data.access_token);
                
                const decodedToken = jwtDecode(response.data.access_token);
                const roles = decodedToken.sub.role;
                const user = decodedToken.sub.id;
                setAuth({user, roles});
                console.log({user, roles});
                if (roles === 'staff') {
                    navigate('/staffhome', { replace: true });
                }
                else if (roles === 'doctor') {
                    navigate('/doctorhome', { replace: true });

                
                }
            })
            .catch(error => {
                console.error('Login failed', error.response.data);
                setLoginError('Incorrect Username or Password.');
            });
    }

    return (
        <div className='main'>
            <div className='mainContainer'>
                
                <header className='header'>Equipment Booking Portal</header>
                {loginError && <Alerts error = {loginError}/>}
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