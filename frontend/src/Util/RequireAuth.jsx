import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./Context";
import {jwtDecode} from 'jwt-decode';
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const refreshToken = localStorage.getItem('refreshToken');





export const RefreshAccessToken = async () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const response = await fetch('/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
            });
            const data = await response.json();
            if (response.ok) {
                
                localStorage.setItem('token', data.accessToken);
                setAuth(data.accessToken);

    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }
}
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
            return false;
            }
            return true;
            }
            return false;
            };
            
const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log('auth:', auth);
    const decodedToken = jwtDecode(auth);
    const roles = decodedToken.sub.role;
    const user = decodedToken.sub.username;
    useEffect(() => {
        const initializeAuth = async () => {
            if (refreshToken && !isAuthenticated()) {
                await RefreshAccessToken();
              
            }
        };
        initializeAuth();
    }, []);

            
            return (
                roles === allowedRoles[0]
                ? <Outlet />
                : user ?<Navigate to="/unauthorized" state={{ from: location }} replace />
                :  <Navigate to="/" state={{ from: location }} replace />
                
                );
                }
                
                export default RequireAuth;