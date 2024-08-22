import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StaffHome from './pages/StaffHomePage';
import RegisterUser from './pages/RegistrationPage';
import BookingPage from './pages/BookingPage.jsx';
import './App.css';
import NotFound from './pages/NotFound';
import { AuthProvider } from './Util/AuthProvider';
import PersistLogin from './components/PersistLogin';
import RequireAuth from './Util/RequireAuth.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import DeleteBooking from './pages/DeleteBooking';
import ManageEquipment from './pages/ManageEquipment';
import UnAuthorized from './pages/UnAuthorized';
import Stats from './pages/Stats.jsx';
import DeleteBooking from './pages/DeleteBooking.jsx';


function App() {
    
    return (
        <div className="App">
            
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route exact path="/register" element={<RegisterUser/>} />
                        <Route exact path="/" element={<LoginPage/>} />
                        <Route exact path="*" element={<NotFound/>} />
                        <Route path="/unauthorized" element={<UnAuthorized/>} />
                        <Route element={<PersistLogin />}>
                            <Route element={<RequireAuth allowedRoles={['staff', 'admin']} />}>
                                <Route path="/staffhome" element={<StaffHome />} />
                            </Route>
                            <Route element={<RequireAuth allowedRoles={['doctor', 'staff', 'admin']} />}>
                                <Route path="/doctorhome" element={<BookingPage />} />
                            </Route>
                            <Route element={<RequireAuth allowedRoles={['admin']} />}>
                                <Route path="/deletebooking" element={<DeleteBooking/>} />
                                <Route path="/manageequipment" element={<ManageEquipment />} />
                                <Route path="/stats" element={<Stats />} />
                            </Route>
                        </Route>

                    </Routes>
                </Router>
            </AuthProvider>
                  
                
            
        </div>
    );
}

export default App;