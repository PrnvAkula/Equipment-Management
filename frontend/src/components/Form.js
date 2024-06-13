

export default function Form({userid, password, setuserid, setpassword, handleSubmit}){

    return (
        <div >
            <form className = "inputContainer"
            onSubmit={handleSubmit}>        
                <input className="inputBox" value ={userid}type="text" placeholder="UserID"
                onChange = {e => setuserid(e.target.value)} />
                <input className="inputBox" type="password" value={password} placeholder="Password"
                onChange = {e => setpassword(e.target.value)} />
                <button className = "inputButton" type="submit">Submit</button>
            </form>
        </div>
    );
}