import Logo from './Logo';

export default function Header({username}) {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function handleSignOut() {
        sessionStorage.removeItem('authToken');
        window.location.reload();
    }
    return (
        <div className="head">
            <Logo/>
            <button id="signOutButton" onClick={handleSignOut}>Sign Out</button>
            {username && <div className="welcome">Welcome, {capitalizeFirstLetter(username)}!</div>}
        </div>
    );
}