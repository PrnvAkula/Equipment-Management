import React, { useState } from 'react';
import TabsExample from '../components/Nav';
import axios from 'axios';

import Details from '../components/Details';
import { Toasts } from '../components/Alerts';
import { decode as base64_decode } from 'base-64';
// import Button from 'react-bootstrap/Button';
function BookingPage() {
    const today = new Date();
    const todaydate = today.getFullYear() + ((today.getMonth() + 1 )>10 ? '-' : '-0') +  (today.getMonth() + 1 ) + '-' + today.getDate();
  
    const [branch, setbranch] = useState('');
    const [ename, setEname] = useState('');
    const [date, setDate] = useState(`${todaydate}`);  
    const [fromTime, setFromTime] = useState('00:00');
    const [toTime, setToTime] = useState('12:00');
    const [surgeryType, setSurgeryType] = useState('');
    const username = base64_decode(sessionStorage.getItem('authToken'));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
        
    function onClose(){
        setError('');
        setSuccess('');
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(todaydate);
            const response = await axios.post('http://127.0.0.1:5000/booking', { username, branch, ename, date, fromTime, toTime, surgeryType});
            console.log('Response:', response.data);
            const message = response.data.message || 'Equipment added successfully';
            setSuccess(message);
            setError('');
            
        } catch (error) {
            console.error('Error:', error);
            const message = error.response?.data?.error || 'Facing an unkown error';
            setError(message);
            setSuccess('');
            

        }
    };
        
    const handleEnameChange = (event) => {
        setEname(event.target.value);  
    }
    const handleBranchChange = (event) => {
        setbranch(event.target.value);  
    }
    return (
        <div>

            <TabsExample op1 = {'Book Equipment'} 
            op2= {'Delete Booking'}
            op1href = {'/doctorhome'}
            op2href = {'/deletebooking'} />
            <div className='equipment'>
                <h2> Welcome, {username}! </h2>
                {error && Toasts( {error :error, type:'Error', onClose : onClose})}
                {success && Toasts( {error :success, type:'Success', onClose: onClose})}
                <form >
                    <div className='equipmentInput'>
                    <label>
                        Branch:
                        {/* <input type="text" value={branch} onChange={e => setbranch(e.target.value)} /> */}
                        <select onChange={handleBranchChange} value={branch}>
                            <option value="">Select Branch</option>
                            <option value="Malakpet">Malakpet</option>
                            <option value="Secunderabad">Secunderabad</option>
                            <option value="Somajiguda">Somajiguda</option>
                        </select>
                    </label>
                    <label>
                        Equipment Name:
                        {/* <input type="text" value={ename} onChange={handleChange} /> */}
                        <select onChange={handleEnameChange} value={ename}>
                            <option value="">Select an Option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </label>
                    </div>
                    {/* <button className='but' type="submit">Submit</button> */}
                </form>
            </div>
            { branch && ename && <Details
            date = {date}
            setDate = {setDate}
            fromTime = {fromTime}
            setFromTime = {setFromTime}
            toTime = {toTime}
            setToTime = {setToTime}
            surgeryType = {surgeryType}
            setSurgeryType = {setSurgeryType}
            />
        }    
        <button className='but' onClick={handleSubmit} type="submit">Submit</button>
            

        </div>
       
    );
}

export default BookingPage;