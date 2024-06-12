import React, {useState} from 'react';
import Form from '../components/Form';
function Login(){
    const [userid, setuserid] = useState('');
    const [password, setpassword] = useState('');   
    function handleSubmit(event){
        event.preventDefault();
        console.log(userid);
        console.log(password);
    }
    return (
        <div className='mainContainer'>
            <header className='header'>Equipment Booking Portal</header>
            <Form userid ={userid}
             password={password} 
             setuserid = {setuserid} 
             setpassword ={setpassword}
             handleSubmit={handleSubmit}/>
        </div>
    );
}
export default Login;