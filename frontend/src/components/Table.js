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
            <table class="table table-striped">
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