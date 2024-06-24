export default function Header({username}) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <div className="head">
            <div className="logo"></div>
            
            {username && <div className="welcome">Welcome, {capitalizeFirstLetter(username)}!</div>}
        </div>
    );
}