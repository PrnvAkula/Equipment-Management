import axios from 'axios';
import useAuth from '../Util/Context';
import {jwtDecode} from 'jwt-decode';
const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        
        const response = await axios.get('http://127.0.0.1:5000/refresh', {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
              }
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.access_token);
            const roles = jwtDecode(response.data.access_token).sub.role;
            return {
                ...prev,
                user: jwtDecode(response.data.access_token).sub.id,
                roles: roles,
                accessToken: response.data.access_token
            }
        });
        return response.data.access_token;
    }
    return refresh;
};

export default useRefreshToken;