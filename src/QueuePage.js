import React, { useEffect, useState } from 'react';

function QueuePage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://mookratha-order-1.onrender.com/orders');
      const data = await res.json();
      // สลับลำดับข้อมูลใหม่ให้กลายเป็น Stack (ใหม่อยู่บน)
      const stackData = data.slice().reverse();
      setOrders(stackData);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusText = (status) => {
    switch (status) {
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

  // ไม่ต้อง sort แล้ว เพราะข้อมูลเป็น stack เรียบร้อย
  const stackOrders = orders;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2>🍽️ คิวออเดอร์ (Stack)</h2>
      <p style={{ marginBottom: 20, color: '#666' }}>
        ตรวจสอบสถานะออเดอร์ของคุณ
      </p>

      {stackOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>ยังไม่มีออเดอร์ในขณะนี้</p>
        </div>
      ) : (
        <div>
          {stackOrders.map((order, index) => (
            <div
              key={order.id}
              style={{
                border: '2px solid #ddd',
                marginBottom: 15,
                padding: 15,
                borderRadius: 8,
                backgroundColor:
                  order.status === 'done' ? '#e8f5e8' :
                  order.status === 'cooking' ? '#fff3cd' :
                  '#f8f9fa'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}>
                <h3 style={{ margin: 0 }}>
                  คิวที่ {index + 1} - โต๊ะ {order.tableNumber}
                </h3>
                <div
                  style={{
                    padding: '5px 12px',
                    borderRadius: 15,
                    backgroundColor:
                      order.status === 'done' ? '#28a745' :
                      order.status === 'cooking' ? '#ffc107' :
                      '#6c757d',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <strong>เลขที่ออเดอร์:</strong> {order.id}
              </div>

              <div style={{ marginBottom: 10 }}>
                <strong>เวลาสั่ง:</strong> {formatDateTime(order.created_at)}
              </div>

              <div style={{ marginBottom: 10 }}>
                <strong>รายการสินค้า:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>
                      {item.name} - จำนวน {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {order.status === 'waiting' && (
                <div style={{ color: '#666', fontSize: 14, fontStyle: 'italic' }}>
                  💡 ออเดอร์ของคุณอยู่ในคิวที่ {index + 1} รอสักครู่นะครับ
                </div>
              )}

              {order.status === 'cooking' && (
                <div style={{ color: '#ff6b35', fontSize: 14, fontWeight: 'bold' }}>
                  🔥 กำลังเตรียมอาหารของคุณ...
                </div>
              )}

              {order.status === 'done' && (
                <div style={{ color: '#28a745', fontSize: 14, fontWeight: 'bold' }}>
                  ✅ อาหารของคุณพร้อมเสิร์ฟแล้ว!
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          กลับไปหน้าสั่งอาหาร
        </button>
      </div>
    </div>
  );
}

export default QueuePage;
