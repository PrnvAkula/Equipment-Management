import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/StaffHomePage';
import RegisterUser from './pages/RegistrationPage';
import AddEquipment from './pages/AddEquipmentPage';
import './App.css';
import HandleDoctor from './pages/HandleDoctor';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route strict path="/" element={<RegisterUser/>} />
                    <Route strict path="/register" element={<RegisterUser/>} />
                    <Route strict path="/handledoctor" element={<HandleDoctor/>} />
                    <Route strict path="/home" element={<HomePage/>} />
                    <Route strict path="/addequipment" element={<AddEquipment/>} />
                    <Route strict path="/login" element={<LoginPage/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;