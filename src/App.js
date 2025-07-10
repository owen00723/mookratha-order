import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderPage from './OrderPage';
import KitchenPage from './KitchenPage';
import './App.css';

function App() {
  return (
    <Router>
      {/* div นี้คือกล่องลอยปุ่ม */}
      <div className="nav-fixed">
        <Link to="/" className="nav-button">หน้าออเดอร์</Link>
        <Link to="/kitchen" className="nav-button">ฝั่งครัว</Link>
      </div>
      
      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
      </Routes>
    </Router>
  );
}

export default App;
