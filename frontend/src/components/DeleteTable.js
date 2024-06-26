import { useState } from "react";
import Button from 'react-bootstrap/Button';
import {Toasts} from   './Alerts';

function DeleteTable({data ,errorr}){
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    function onClose(){
        setError('');
        setSuccess('');
    }
    
    // function formatDate(dateString) {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    //     const day = date.getDate().toString().padStart(2, '0');
    //     return `${day}-${month}-${year}`;
    //   }
    // data = data.map((row) => {
    //     row.date = formatDate(row.date);
    //     return row;
    // });
    function handleCheckboxChange(event, row){
        if (event.target.checked) {
          setSelectedRows([...selectedRows, row]);
        } else {
          setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
        }
      }
      
        function handleDelete(){
            if (selectedRows.length === 0) {
                setError('Please select atleast one Booking to delete');
                return;
            }
            selectedRows.forEach(row => {
            fetch(`http://127.0.0.1:5000/bookings/${row.id}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                    setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
                    setSuccess('Bookings deleted successfully');
                    setError('');
                    } else {
                    setError('Failed to delete item');
                    setSuccess('');
                    
                    }
                })
                .catch(error => console.error('Error:', error));
            });
            window.location.reload();
  };
        
    return (
        <div>
            {error && Toasts( {error :error, type:'Error', onClose : onClose})}
            {success && Toasts( {error :success, type:'Success', onClose : onClose})}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th scope="col"></th> */}
                        <th scope="col">#</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Equipment</th>
                        <th scope="col">Surgery Type</th>
                        <th scope="col">From </th>
                        <th scope="col">To</th>
                        <th scope="col">Date</th>           
                    </tr>
                </thead>
                <tbody>
                {!errorr && data.map((row, index) => (
                    <tr key={index}>
                    {/* <th scope="row">{index+1}</th> */}
                    <td>
                    <input
                        type="checkbox"
                        checked={selectedRows.some(selectedRow => selectedRow.id === row.id)}
                        onChange={event => handleCheckboxChange(event, row)}
                    />
                    </td>
                    <td>{row.branch}</td>
                    <td>{row.userid}</td>
                    <td>{row.ename}</td>
                    <td>{row.surgeryType}</td>
                    <td>{row.fromTime}</td>
                    <td>{row.toTime}</td>
                    <td>{row.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button onClick={handleDelete} className='but'>Delete</Button>{' '}
        </div>
    );
}
export default DeleteTable;