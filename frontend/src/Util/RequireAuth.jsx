import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./Context";


 
const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    
    return (
        auth?.roles === allowedRoles[0] || auth?.roles === allowedRoles[1] || auth?.roles === allowedRoles[2]
            ? <Outlet/>
            : auth?.accessToken 
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/" state={{ from: location }} replace />
    );
}
                
export default RequireAuth;