import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoutes';
import CreateCampaign from './pages/CreateCampaign';
import Campaign from "./pages/Campaign.jsx";
import Customer from "./pages/Customer.jsx";
import Orders from './pages/Orders.jsx';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-campaign"
                    element={
                        <ProtectedRoute>
                            <CreateCampaign />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/campaign"
                    element={
                        <ProtectedRoute>
                            <Campaign />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customer />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
