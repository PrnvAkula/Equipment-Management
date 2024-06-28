
// import { useNavigate} from 'react-router-dom';
import { useAuth } from './Context';
import { Navigate } from 'react-router';
 



const RequireAuth = ({ children }) => {

  let auth = useAuth();
  auth.isAuthenticated = sessionStorage.getItem('authToken') ? true : false;

    if (!auth.isAuthenticated) {
      return <Navigate to="/" />;
    }

  return children;
};
export default RequireAuth;