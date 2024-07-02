import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StaffHome from './pages/StaffHomePage';
import RegisterUser from './pages/RegistrationPage';
import BookingPage from './pages/BookingPage.jsx';
import './App.css';
import NotFound from './pages/NotFound';
import { AuthProvider } from './Util/AuthProvider';

import RequireAuth from './Util/RequireAuth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteBooking from './pages/DeleteBooking';
import ManageEquipment from './pages/ManageEquipment';



function App() {
    
    return (
        <div className="App">
            
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route exact path="/register" element={<RegisterUser/>} />
                        <Route exact path="/" element={<LoginPage/>} />
                        <Route exact path="*" element={<NotFound/>} />
                        <Route element={<RequireAuth allowedRoles={['staff']} />}>
                        <Route path="/staffhome" element={<StaffHome />} />
                        <Route path="/manageequipment" element={<ManageEquipment />} />
                        </Route>
                        
                        <Route element={<RequireAuth allowedRoles={['doctor']} />}>
                        <Route path="/doctorhome" element={<BookingPage />} />
                        <Route path="/deletebooking" element={<DeleteBooking />} />
                        </Route>
                        {/* <Route exact path="/staffhome" element={<StaffHome />} />
                        <Route exact path="/doctorhome" element={<BookingPage />} />
                        <Route exact path="/deletebooking" element = {<DeleteBooking/>}/>
                        <Route exact path="/manageequipment" element = {<ManageEquipment/>}/> */}
                    </Routes>
                </Router>
            </AuthProvider>
                  
                
            
        </div>
    );
}

export default App;