import React, { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Details from '../components/Details';

function AddEquipment() {
    const today = new Date();
    const todaydate = today.getFullYear() + ((today.getMonth() + 1 )>10 ? '-' : '-0') +  (today.getMonth() + 1 ) + '-' + today.getDate();
    const location = useLocation();
    const [branch, setbranch] = useState('');
    const [ename, setEname] = useState('');
    const [date, setDate] = useState(`${todaydate}`);  
    const [fromTime, setFromTime] = useState('00:00');
    const [toTime, setToTime] = useState('12:00');
    const [surgeryType, setSurgeryType] = useState('');
    const { username } = location.state || {};
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(date, fromTime, toTime, surgeryType,ename, branch);
        try {
            const response = await axios.post('http://127.0.0.1:5000/add_equipment', { username, branch, ename, date, fromTime, toTime, surgeryType});
            console.log('Response:', response.data);
            // navigate('/handledoctor');
        } catch (error) {
            console.error('Error:', error);
            // Handle error, show error message, etc.
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

            <Header
            username = {username}/>
            <div className='equipment'>
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

export default AddEquipment;