import {Link} from 'react-router-dom';

export default function Form({userid, password, setuserid, setpassword, handleSubmit,buttoner,login, register}){
    
    return (
        <div >
            <form className = "inputContainer"
            onSubmit={handleSubmit}>        
                <input className="inputBox" value ={userid}type="text" placeholder="UserID"
                onChange = {e => setuserid(e.target.value)} />
                <input className="inputBox" type="password" value={password} placeholder="Password"
                onChange = {e => setpassword(e.target.value)} />
                {login && <p>Don't have an account? <Link to="/register">Register</Link></p>}
                {register && <p>Already have an account? <Link to="/">Login</Link></p>}
                <button className = "inputButton" type="submit">{buttoner}</button>
            </form>
        </div>
    );
}