import React, { useState , useEffect} from 'react';
import TabsExample from '../components/Nav';
import axios from 'axios';
import Details from '../components/Details';
import { Toasts } from '../components/Alerts';
import Alerts from '../components/Alerts';
import { jwtDecode } from 'jwt-decode';
import useAuth from '../Util/Context';


function BookingPage() {

    const today = new Date();            
    const todaydate = today.getFullYear() + ((today.getMonth() + 1 )>9 ? '-' : '-0') +  (today.getMonth() + 1 ) + ((today.getDate())>9 ? '-':'-0') + (today.getDate());
    const currentTime = today.getHours() + ':' + today.getMinutes();
    const [branch, setbranch] = useState('');
    const [ename, setEname] = useState('');
    const [startDate, setStartDate] = useState(`${todaydate}`);  
    const [endDate, setEndDate] = useState(`${todaydate}`);  
    const [fromTime, setFromTime] = useState(`${currentTime}`);
    const [toTime, setToTime] = useState('23:59');
    const [surgeryType, setSurgeryType] = useState('');
    const username = jwtDecode(localStorage.getItem('token')).sub.id;
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [equipments, setEquipments] = useState([]);
    const [data, setData] = useState([]);
    const [errorr, setErrorr] = useState('');


    
    useEffect(() => {
        fetch('http://127.0.0.1:5000/equipment')
          .then(response => response.json())
          .then(data =>{ setEquipments(data)
          })
          .catch(error => console.log('Error fetching data:', error));
          
      }, []);
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/equipment/${ename}`)
        .then(response => response.json())
        .then(data =>{ setData(data)
            setErrorr(data.message)
        })
        .catch(error => console.log('Error fetching data:', error));
    }, [ename]);
 
        
    function onClose(){
        setError('');
        setSuccess('');
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(todaydate);
            console.log(today);
            console.log(fromTime);
            const response = await axios.post('http://127.0.0.1:5000/booking', { 
                username, branch, ename, startDate, endDate, fromTime, toTime, surgeryType, 
            });
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
                            <option value="">Select Equipment</option>
                            {equipments.map((equipment, index) => (
                                <option key={index} value={equipment.equipment}>{equipment.equipment}</option>
                            ))}
                        </select>
                    </label>
                    </div>
                    {/* <button className='but' type="submit">Submit</button> */}
                </form>
            </div>
            { branch && ename && <Details
            startDate = {startDate}
            setStartDate = {setStartDate}
            endDate = {endDate}
            setEndDate = {setEndDate}
            fromTime = {fromTime}
            setFromTime = {setFromTime}
            toTime = {toTime}
            setToTime = {setToTime}
            surgeryType = {surgeryType}
            setSurgeryType = {setSurgeryType}
            />
        }    
        <button className='but' onClick={handleSubmit} type="submit">Submit</button>
        <br/>

        {errorr && <div><h2>Active Bookings For {ename}</h2>  <Alerts error = {errorr}/></div>}
        
        {!errorr && data.length > 0 &&
        <>
            <div  className='activeBookings'>
            <h2>Active Bookings For {ename}</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Branch</th>
                            <th scope="col">Equipment</th>
                            <th scope="col">Surgery Type</th>
                            <th scope="col">Start Date</th>           
                            <th scope="col">From </th>
                            <th scope="col">End Date </th>
                            <th scope="col">To</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{row.branch}</td>
                        <td>{row.ename}</td>
                        <td>{row.surgeryType}</td>
                        <td>{row.startDate}</td>
                        <td>{row.fromTime}</td>
                        <td>{row.endDate}</td>
                        <td>{row.toTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        
            </>
        }

        </div>
       
    );
}

export default BookingPage;