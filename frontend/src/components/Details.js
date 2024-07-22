
function Details({ startDate, setStartDate, endDate, setEndDate, fromTime, setFromTime, toTime, setToTime, surgeryType, setSurgeryType, doctorName, handleDoctorNameChange }) {

    const handleStartChange = (event) => {
        setStartDate(event.target.value); 
      }
    const handleEndChange = (event) => {
        setEndDate(event.target.value); 
      }
    const handleFromChange = (event) => {
        setFromTime(event.target.value); 
      }
    const handleToChange = (event) => {
        setToTime(event.target.value); 
      }
  return (
    <div className='details'>
        <br/>
        <br/>
        <label for="date">Start Date:</label>
          <input  value = {startDate} type="date" id="date" name="date" onChange={handleStartChange}/>
          <label for="date">End Date:</label>
          <input  value = {endDate} type="date" id="date" name="date" onChange={handleEndChange}/>
        <label for="time">From:</label>
          <input type="time" className="fromtime" name="time" value={fromTime} onChange={handleFromChange}/>
        <label for="time">To:</label>
          <input type="time" className="totime" name="time" value={toTime} onChange={handleToChange}/>
        <label>
            Surgery Type:
          <input type="text" value={surgeryType} onChange={e => setSurgeryType(e.target.value)} className='surgery-type-box' />
        </label>
        <br/>
        <br/>
        <label>
            Doctor Name:
          <input type="text" value={doctorName} onChange={handleDoctorNameChange} className='surgery-type-box' />
        </label>
        <br/>
        <br/>
    </div>
  );
}

export default Details;