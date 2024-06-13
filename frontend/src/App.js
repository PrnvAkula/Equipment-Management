import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddEquipment from './pages/addEquipment';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/homePage';
import RegisterUser from './pages/registerUser';
import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/home" element={<HomePage/>} />
                    <Route path="/addequipment" element={<AddEquipment/>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/register" element={<RegisterUser/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;