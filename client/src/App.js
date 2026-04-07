import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import WorkerProfile from './pages/WorkerProfile';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import AddService from './pages/AddService';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/add-service" element={<AddService />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
