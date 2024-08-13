import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { Toasts } from './Alerts';
import axios from 'axios';

function DeleteTable({ data, errorr, afterDelete }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');
    const [editStartDate, setEditStartDate] = useState('');
    const [editEndDate, setEditEndDate] = useState('');
    const [editRowId, setEditRowId] = useState(null);

    const handleEditClick = (row) => {
        setEditRowId(row.id);
        setEditStartTime(row.fromTime);
        setEditEndTime(row.toTime);
        setEditStartDate(row.startDate);
        setEditEndDate(row.endDate);
    };

    const handleSaveClick = (row) => {
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
    
        const payload = {
            fromTime: editStartTime,
            toTime: editEndTime,
            startDate: formatDate(editStartDate),
            endDate: formatDate(editEndDate)
        };
    
        console.log("Payload:", payload); // Debugging line
    
        axios.put(`http://127.0.0.1:5000/editbooking/${row.id}`, payload)
            .then(response => {
                if (response.status === 200) {
                    setSuccess('Booking updated successfully');
                    setError('');
                    window.location.reload();
                } else {
                    setError('Failed to update booking');
                    setSuccess('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.response) {
                    console.error('Server Response:', error.response.data); // Log server response
                    setError(`Failed to update booking: ${error.response.data.error}`);
                } else {
                    setError('Failed to update booking (client-side error)');
                }
                setSuccess('');
            });
        setEditRowId(null);
    };


    function onClose() {
        setError('');
        setSuccess('');
    }
    function handleCheckboxChange(event, row) {
        if (event.target.checked) {
            setSelectedRows([...selectedRows, row]);
        } else {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
        }
    }
    function handleDelete() {
        if (selectedRows.length === 0) {
            setError('Please select atleast one Booking to delete');
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to delete these bookings?");
        if (isConfirmed) {

            selectedRows.forEach(row => {
                fetch(`http://127.0.0.1:5000/bookings/${row.id}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
                            setSuccess('Bookings deleted successfully');
                            setError('');
                            window.location.reload();
                        } else {
                            setError('Failed to delete item');
                            setSuccess('');

                        }
                    })
                    .catch(error => console.error('Error:', error));
                // afterDelete(row.id);
            });
        }
        else {
            console.log("Delete operation was canceled by the user.");
        }
    };

    return (
        <div>
            {error && Toasts({ error: error, type: 'Error', onClose: onClose })}
            {success && Toasts({ error: success, type: 'Success', onClose: onClose })}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th scope="col"></th> */}
                        <th scope="col">#</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Equipment</th>
                        <th scope="col">Surgery Type</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">From </th>
                        <th scope="col">End Date</th>
                        <th scope="col">To</th>
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
                            <td>{row.doctorName}</td>
                            <td>{row.ename}</td>
                            <td>{row.surgeryType}</td>
                            <td>
                                {editRowId === row.id ? (
                                    <input
                                        type="date"
                                        value={editStartDate}
                                        onChange={(e) => setEditStartDate(e.target.value)}
                                    />
                                ) : (
                                    row.startDate
                                )}
                            </td>
                            <td>
                                {editRowId === row.id ? (
                                    <input
                                        type="time"
                                        value={editStartTime}
                                        onChange={(e) => setEditStartTime(e.target.value)}
                                    />
                                ) : (
                                    row.fromTime
                                )}
                            </td>
                            <td>
                                {editRowId === row.id ? (
                                    <input
                                        type="date"
                                        value={editEndDate}
                                        onChange={(e) => setEditEndDate(e.target.value)}
                                    />
                                ) : (
                                    row.endDate
                                )}
                            </td>
                            <td>{editRowId === row.id ? (
                                <input
                                    type="time"
                                    value={editEndTime}
                                    onChange={(e) => setEditEndTime(e.target.value)}
                                />
                            ) : (
                                row.toTime
                            )}
                            </td>
                            <td>
                                {editRowId === row.id ? (
                                    <Button onClick={() => handleSaveClick(row)}>Save</Button>
                                ) : (
                                    <Button onClick={()=> handleEditClick(row)}>Edit</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {!errorr &&
                <Button onClick={handleDelete} className='but'>Delete</Button>}
        </div>

    );
}
export default DeleteTable;