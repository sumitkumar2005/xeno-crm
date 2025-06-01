import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (credentialResponse) => {
        const decoded = jwt_decode(credentialResponse.credential);

        const { email, name, picture } = decoded;

        try {
            const res = await axios.post('http://localhost:5000/api/auth/google', {
                email, name, picture,
                token: credentialResponse.credential,
            });

            // Save token locally
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return (
        <div className="flex flex-col items-center mt-20">
            <h1 className="text-2xl font-bold mb-6">Welcome to Xeno CRM</h1>
            <GoogleLogin onSuccess={handleLogin} onError={() => alert("Login Failed")} />
        </div>
    );
}
