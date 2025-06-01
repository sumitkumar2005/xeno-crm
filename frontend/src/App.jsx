import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="814539083695-2afugjt41r7u9s6i78mg8c6eiqqe6ur2.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);
