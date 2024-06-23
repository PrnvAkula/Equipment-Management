
function Details({date , setDate, fromTime, setFromTime, toTime, setToTime, surgeryType, setSurgeryType}) {

    const handleChange = (event) => {
        setDate(event.target.value); 
      }
    
    const handleFromChange = (event) => {
        setFromTime(event.target.value); 
      }
    const handleToChange = (event) => {
        setToTime(event.target.value); 
      }
  return (
    <div>
        <br/>
        <br/>
        <label for="date">Date:</label>
          <input  value = {date} type="date" id="date" name="date" onChange={handleChange}/>
        <label for="time">From:</label>
          <input type="time" className="fromtime" name="time" value={fromTime} onChange={handleFromChange}/>
        <label for="time">To:</label>
          <input type="time" className="totime" name="time" value={toTime} onChange={handleToChange}/>
        <label>
            Surgery Type:
          <input type="text" value={surgeryType} onChange={e => setSurgeryType(e.target.value)} />
        </label>
        <br/>
        <br/>


    </div>
  );
}

export default Details;