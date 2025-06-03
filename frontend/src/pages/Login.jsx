import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const { email, name, picture } = decoded;

            const res = await axios.post('https://xeno-crm-omega.vercel.app/api/auth/google', {
                email, name, picture,
                token: credentialResponse.credential
            });

            localStorage.setItem("token", res.data.token);
            navigate("/dashboard"); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            alert("Login failed");
            setIsLoading(false);
        }
    };

    const handleError = () => {
        alert("Login Failed");
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute top-40 left-1/3 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>

            {/* Main Container */}
            <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Sign in to <span className="font-semibold text-indigo-600">Xeno CRM</span>
                    </p>
                </div>

                {/* Google Login Button Container */}
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-white rounded-2xl p-4 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                    <span className="ml-3 text-gray-600">Signing you in...</span>
                                </div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleLogin}
                                    onError={handleError}
                                    size="large"
                                    theme="outline"
                                    text="signin_with"
                                    shape="rectangular"
                                    width="100%"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                       Made by sumit kumar jha
                    </p>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>
    );
}