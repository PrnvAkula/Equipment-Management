function Table({data}){

    
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
                        <th scope="col">From </th>
                        <th scope="col">To</th>
                        <th scope="col">Date</th>           
                    </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                    <th scope="row">{index+1}</th>
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
        </div>
    );
}
export default Table;