import React, { useState } from 'react';
import axios from 'axios';

function AddEquipment() {
    const [eid, setEid] = useState('');
    const [ename, setEname] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('http://127.0.0.1:5000/add_equipment', { eid, ename });
        console.log(response.data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Equipment ID:
                <input type="number" value={eid} onChange={e => setEid(e.target.value)} />
            </label>
            <label>
                Equipment Name:
                <input type="text" value={ename} onChange={e => setEname(e.target.value)} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default AddEquipment;