import React, { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import Details from '../components/Details';

function AddEquipment() {
    const today = new Date();
    const todaydate = today.getFullYear() + ((today.getMonth() + 1 )>10 ? '-' : '-0') +  (today.getMonth() + 1 ) + '-' + today.getDate();

    const [branch, setbranch] = useState('');
    const [ename, setEname] = useState('');
    const [date, setDate] = useState(`${todaydate}`);  
    const [fromTime, setFromTime] = useState('00:00');
    const [toTime, setToTime] = useState('12:00');
    const [surgeryType, setSurgeryType] = useState('');
    
    // const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/add_equipment', { branch, ename });
            console.log('Response:', response.data);
            // navigate('/handledoctor');
        } catch (error) {
            console.error('Error:', error);
            // Handle error, show error message, etc.
        }
        
        
    };
    

    return (
        <div>
            <Header/>
            <div className='equipment'>
                <form onSubmit={handleSubmit}>
                    <div className='equipmentInput'>
                    <label>
                        Branch:
                        <input type="text" value={branch} onChange={e => setbranch(e.target.value)} />
                    </label>
                    <label>
                        Equipment Name:
                        <input type="text" value={ename} onChange={e => setEname(e.target.value)} />
                    </label>
                    </div>
                    {/* <button className='but' type="submit">Submit</button> */}
                </form>
            </div>
            <Details
            date = {date}
            setDate = {setDate}
            fromTime = {fromTime}
            setFromTime = {setFromTime}
            toTime = {toTime}
            setToTime = {setToTime}
            surgeryType = {surgeryType}
            setSurgeryType = {setSurgeryType}
            />
            <button className='but' onClick={handleSubmit} type="submit">Submit</button>

        </div>
       
    );
}

export default AddEquipment;