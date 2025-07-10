import React, { useEffect, useState } from 'react';
import './KitchenPage.css';

function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ฟังก์ชันสำหรับดึงข้อมูลออเดอร์จาก Backend
  const fetchOrders = async () => {
    try {
      const res = await fetch('https://mookratha-order-1.onrender.com/orders');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data);
      console.log('Fetched orders from API:', data);
    } catch (error) {
      setOrders([]);
      console.error('Failed to fetch orders:', error);
      alert('ไม่สามารถดึงข้อมูลออเดอร์ได้ กรุณาตรวจสอบ Server');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    console.log(`Attempting to update status for Order ID: ${id}, New Status: ${status}`);
    try {
      const res = await fetch(`https://mookratha-order-1.onrender.com/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchOrders();
    } catch (error) {
      alert('ไม่สามารถอัพเดตสถานะได้');
      console.error('Error updating status:', error);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('ต้องการลบออเดอร์นี้ใช่หรือไม่?')) return;
    console.log(`Attempting to delete Order ID: ${id}`);
    try {
      const res = await fetch(`https://mookratha-order-1.onrender.com/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchOrders();
    } catch (error) {
      alert('ไม่สามารถลบออเดอร์ได้');
      console.error('Error deleting order:', error);
    }
  };

  const deleteAllDoneOrders = async () => {
    if (!window.confirm('ต้องการลบออเดอร์ทั้งหมดที่สถานะเสร็จแล้วใช่หรือไม่?')) return;
    console.log('Attempting to delete all done orders.');
    try {
      const res = await fetch('https://mookratha-order-1.onrender.com/orders', { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchOrders();
    } catch (error) {
      alert('ไม่สามารถลบออเดอร์ทั้งหมดได้');
      console.error('Error deleting all done orders:', error);
    }
  };

  const pendingOrders = orders.filter(o => o.status !== 'done');
  const doneOrders = orders.filter(o => o.status === 'done');

  const getStatusText = (status) => {
    switch(status) {
      case 'waiting': return 'รอทำ';
      case 'cooking': return 'กำลังทำ';
      case 'done': return 'เสร็จแล้ว';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('th-TH', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });
  };

  const OrderCard = ({ order, isHistory = false }) => (
    <div className={`order-card ${order.status} ${isHistory ? 'history' : 'pending'}`}>
      <div className="order-header">
        <span className="order-id">เลขที่ออเดอร์: {order.id}</span>
        <span className="order-table">โต๊ะ {order.tableNumber || 'ไม่ได้ระบุ'}</span>
      </div>
      
      <div className="order-time">
        {isHistory ? 'เวลาเสร็จ: ' : 'เวลาสั่ง: '}{formatDateTime(order.created_at)}
      </div>
      
      <div className={`status-badge ${order.status}`}>
        สถานะ: {getStatusText(order.status)}
      </div>
      
      <div className="items-header">รายการสินค้า:</div>
      <ul className="items-list">
        {order.items.map((item, i) => (
          <li key={i}>
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">{item.quantity}</span>
          </li>
        ))}
      </ul>
      
      <div className="action-buttons">
        {!isHistory ? (
          <>
            <button
              className={`action-btn cooking-btn ${order.status === 'cooking' ? 'disabled' : ''}`}
              onClick={() => updateStatus(order.id, 'cooking')}
              disabled={order.status === 'done' || order.status === 'cooking'}
            >
              {order.status === 'cooking' ? (
                <>
                  <span className="loading-spinner"></span>
                  กำลังทำ
                </>
              ) : (
                <>
                  🔥 เตรียมอาหาร
                </>
              )}
            </button>
            <button
              className={`action-btn done-btn ${order.status === 'done' ? 'disabled' : ''}`}
              onClick={() => updateStatus(order.id, 'done')}
              disabled={order.status === 'done'}
            >
              {order.status === 'done' ? (
                <>
                  ✅ เสร็จแล้ว
                </>
              ) : (
                <>
                  ✅ ยืนยันเสร็จแล้ว
                </>
              )}
            </button>
          </>
        ) : (
          <button
            className="action-btn delete-btn"
            onClick={() => deleteOrder(order.id)}
          >
            🗑️ ลบออเดอร์นี้
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="kitchen-page">
      <h2>👩‍🍳 ฝั่งครัว</h2>

      <div className="tab-navigation">
        <button
          className={`tab-button ${!showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(false)}
        >
          📋 ออเดอร์รอทำ ({pendingOrders.length})
        </button>
        <button
          className={`tab-button ${showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(true)}
        >
          📚 ประวัติออเดอร์ ({doneOrders.length})
        </button>
      </div>

      {!showHistory ? (
        <>
          <h3>ออเดอร์รอทำ ({pendingOrders.length})</h3>
          {pendingOrders.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีออเดอร์รอทำในขณะนี้</p>
            </div>
          ) : (
            pendingOrders
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(order => (
                <OrderCard key={order.id} order={order} />
              ))
          )}
        </>
      ) : (
        <>
          <h3>ประวัติออเดอร์ ({doneOrders.length})</h3>
          {doneOrders.length > 0 && (
            <button
              className="action-btn delete-all-btn"
              onClick={deleteAllDoneOrders}
            >
             ลบประวัติออเดอร์ทั้งหมด
            </button>
          )}
          {doneOrders.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีประวัติออเดอร์ในขณะนี้</p>
            </div>
          ) : (
            doneOrders
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(order => (
                <OrderCard key={order.id} order={order} isHistory={true} />
              ))
          )}
        </>
      )}
    </div>
  );
}

export default KitchenPage;