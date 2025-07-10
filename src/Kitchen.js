import React, { useEffect, useState } from 'react';

function KitchenPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://mookratha-order-1.onrender.com/orders');
      const data = await res.json();
      setOrders(data);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // รีเฟรชทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://mookratha-order-1.onrender.com/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      alert('ไม่สามารถอัพเดตสถานะได้');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('ต้องการลบออเดอร์นี้ใช่หรือไม่?')) return;
    try {
      await fetch(`https://mookratha-order-1.onrender.com/orders/${id}`, {
        method: 'DELETE',
      });
      fetchOrders();
    } catch {
      alert('ไม่สามารถลบออเดอร์ได้');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>👩‍🍳 ฝั่งครัว - รายการออเดอร์</h2>
      {orders.length === 0 && <p>ยังไม่มีออเดอร์</p>}
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', marginBottom: 15, padding: 10 }}>
          <p><b>เลขที่ออเดอร์:</b> {order.id}</p>
          <p><b>โต๊ะ:</b> {order.tableNumber}</p>
          <p><b>เวลา:</b> {new Date(order.created_at).toLocaleString()}</p>
          <p><b>สถานะ:</b> {order.status}</p>
          <p><b>รายการสินค้า:</b></p>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>{item.name} - {item.price} บาท</li>
            ))}
          </ul>
          <div>
            {['waiting', 'cooking', 'done'].map(status => (
              <button
                key={status}
                style={{
                  marginRight: 5,
                  backgroundColor: order.status === status ? '#666' : '#008CBA',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
                onClick={() => updateStatus(order.id, status)}
              >
                {status}
              </button>
            ))}
            <button
              onClick={() => deleteOrder(order.id)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 12px',
                cursor: 'pointer',
                marginLeft: 10,
              }}
            >
              ลบออเดอร์
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KitchenPage;
