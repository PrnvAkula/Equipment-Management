function Table({data}){
    function slicingDate(data){
    for (let i = 0; i < data.length; i++) {
        data[i].date = (data[i].date).slice(6,16);
      }
      return data;

    }
    data = slicingDate(data);
    return (
        <div>
                    <table>
                <thead>
                <tr>
                    <th>Branch</th>
                    <th>Doctor</th>
                    <th>Equipment</th>
                    <th>Surgery Type</th>
                    <th>From </th>
                    <th>To</th>
                    <th>Date</th>           
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
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