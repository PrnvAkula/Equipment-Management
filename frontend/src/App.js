import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/StaffHomePage';
import RegisterUser from './pages/RegistrationPage';
import AddEquipment from './pages/AddEquipmentPage';
import './App.css';
import NotFound from './pages/NotFound';
import { AuthProvider } from './Util/Context';
import RequireAuth from './Util/RequireAuth.jsx';

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                <Routes>
                    <Route exact path="/register" element={<RegisterUser/>} />
                    <Route exact path="*" element={<NotFound/>} />
                    <Route exact path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
                    <Route exact path="/addequipment" element={<RequireAuth><AddEquipment /></RequireAuth>} />
                    <Route exact path="/" element={<LoginPage/>} />
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;