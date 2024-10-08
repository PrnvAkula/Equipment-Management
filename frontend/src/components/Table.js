function Table({data}){        
    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        
                        <th scope="col">#</th>
                        <th scope="col">Branch</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Equipment</th>
                        <th scope="col">Surgery Type</th>
                        <th scope="col">Start Date</th>           
                        <th scope="col">From Time</th>
                        <th scope="col">End Date </th>
                        <th scope="col">To Time</th>
                        <th scope="col">Booking Time</th>
                        <th scope="col">Booking Date</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{row.branch}</td>
                    <td>{row.doctorName}</td>
                    <td>{row.ename}</td>
                    <td>{row.surgeryType}</td>
                    <td>{row.startDate}</td>
                    <td>{row.fromTime}</td>
                    <td>{row.endDate}</td>
                    <td>{row.toTime}</td>
                    <td>{row.bookingTime}</td>
                    <td>{row.bookingDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default Table;