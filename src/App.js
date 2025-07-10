import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OrderPage from './OrderPage';
import KitchenPage from './KitchenPage';
import QueuePage from './QueuePage'; // เพิ่มหน้านี้เข้ามา
import './App.css';

function App() {
  return (
    <Router>
      {/* กล่องลอยด้านบน (Navbar ลอย) */}
      <div className="nav-fixed">
        <Link to="/" className="nav-button">หน้าออเดอร์</Link>
        <Link to="/kitchen" className="nav-button">ฝั่งครัว</Link>
        <Link to="/queue" className="nav-button">ดูคิวออเดอร์</Link> {/* ลิงก์ใหม่ */}
      </div>

      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/queue" element={<QueuePage />} /> {/* เส้นทางใหม่ */}
      </Routes>
    </Router>
  );
}

export default App;
