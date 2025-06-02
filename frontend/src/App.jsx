import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoutes';
import CreateCampaign from './pages/CreateCampaign';
// import CampaignHistory from './pages/CampaignHistory';

function App() {
    return (
        <ProtectedRoute>

        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                {/*<Route path="/campaigns" element={<CampaignHistory />} />*/}
            </Routes>
        </Router>
        </ProtectedRoute>
    );
}

export default App;
