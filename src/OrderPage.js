import React, { useState } from 'react';
import './OrderPage.css'; // เพิ่มบรรทัดนี้เพื่อลิ้งไฟล์ CSS

const menu = [
    { id: 1, name: 'หมูสไลด์', image: '/img/1.1.png' },
    { id: 2, name: 'หมูติดมัน', image: '/img/2.png' },
    { id: 3, name: 'หมูสันนอก', image: '/img/3.png' },
  { id: 4, name: 'หมูสามชั้นสไลด์', image: '/img/1.png' },
  { id: 5, name: 'หมูบด', image: '/img/4.png' },
  { id: 6, name: 'ผักรวม', image: '/img/5.png' },
  { id: 7, name: 'ผักกาดขาว', image: '/img/6.png' },
  { id: 8, name: 'ข้าวโพดอ่อน', image: '/img/7.png' },
  { id: 9, name: 'ข้าวโพด', image: '/img/rzeegw042ol7vz7sj808.png' },
  { id: 10, name: 'สาหร่าย', image: '/img/8.png' },
  { id: 11, name: 'ผักบุ้ง', image: '/img/9.png' },
  { id: 12, name: 'ไส้กรอก', image: '/img/10.png' },
  { id: 13, name: 'ชัส', image: '/img/11.png' },
  { id: 14, name: 'ไข่', image: '/img/12.png' },
  { id: 15, name: 'กุ้ง', image: '/img/13.png' },
  { id: 16, name: 'หมึก', image: '/img/14.png' },
  { id: 17, name: 'ดอลลี่', image: '/img/15.png' },
  { id: 18, name: 'หมึกกรอบ', image: '/img/18.png' },
  { id: 19, name: 'แมงกระพรุน', image: '/img/19.png' }
];

function OrderPage() {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 0) return;
    setCart(prevCart => {
      if (quantity === 0) {
        return prevCart.filter(item => item.id !== id);
      }
      const index = prevCart.findIndex(item => item.id === id);
      if (index >= 0) {
        const newCart = [...prevCart];
        newCart[index].quantity = quantity;
        return newCart;
      } else {
        const item = menu.find(m => m.id === id);
        return [...prevCart, { id, name: item ? item.name : '', quantity }];
      }
    });
  };

  const submitOrder = async () => {
    if (!tableNumber) {
      alert("กรุณาเลือกโต๊ะ");
      return;
    }
    if (cart.length === 0) {
      alert("กรุณาเลือกเมนู");
      return;
    }

    try {
      setIsOrdering(true);
      const res = await fetch('https://mookratha-order-1.onrender.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber: Number(tableNumber), items: cart }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to send order with status: ${res.status}`);
      }

      const data = await res.json();
      setMessage(`ส่งออเดอร์จากโต๊ะ ${tableNumber} สำเร็จ เลขที่ออเดอร์: ${data.orderId}`);
      setCart([]);
      setTableNumber('');
      setShowSuccess(true);

    } catch (error) {
      alert(`ส่งออเดอร์ไม่สำเร็จ: ${error.message}`);
      console.error('Error submitting order:', error);
    } finally {
      setIsOrdering(false);
    }
  };

  // Component สำหรับแสดงคิว
  const QueueComponent = () => {
    const [orders, setOrders] = useState([]);

    React.useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await fetch('https://mookratha-order-1.onrender.com/orders');
          const data = await res.json();
          setOrders(data);
        } catch {
          setOrders([]);
        }
      };

      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }, []);

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

    const sortedOrders = orders
      .slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return (
      <div style={{ marginTop: 20, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>🍽️ คิวออเดอร์</h3>
          <button 
            onClick={() => setShowQueue(false)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: 3,
              cursor: 'pointer'
            }}
          >
            ปิด
          </button>
        </div>

        {orders.length === 0 ? (
          <p>ยังไม่มีออเดอร์ในขณะนี้</p>
        ) : (
          <div>
            {sortedOrders.map((order, index) => (
              <div 
                key={order.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  marginBottom: 10, 
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: 
                    order.status === 'done' ? '#e8f5e8' : 
                    order.status === 'cooking' ? '#fff3cd' : 
                    '#f8f9fa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <strong>คิวที่ {index + 1} - โต๊ะ {order.tableNumber}</strong>
                  <span 
                    style={{ 
                      padding: '3px 8px', 
                      borderRadius: 10,
                      backgroundColor: 
                        order.status === 'done' ? '#28a745' : 
                        order.status === 'cooking' ? '#ffc107' : 
                        '#6c757d',
                      color: 'white',
                      fontSize: 12
                    }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div style={{ fontSize: 14, color: '#666' }}>
                  เลขที่ออเดอร์: {order.id} | เวลา: {formatDateTime(order.created_at)}
                </div>

                <div style={{ marginTop: 5 }}>
                  <strong>รายการ:</strong> {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                </div>

                {order.status === 'waiting' && (
                  <div style={{ color: '#666', fontSize: 12, fontStyle: 'italic', marginTop: 5 }}>
                    💡 อยู่ในคิวที่ {index + 1}
                  </div>
                )}

                {order.status === 'cooking' && (
                  <div style={{ color: '#ff6b35', fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>
                    🔥 กำลังเตรียมอาหาร...
                  </div>
                )}

                {order.status === 'done' && (
                  <div style={{ color: '#28a745', fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>
                    ✅ พร้อมเสิร์ฟแล้ว!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="order-page">
      <h2>🧑‍🍳 สั่งอาหารหมูกระทะ</h2>

      <div className="table-select">
        <label>
          โต๊ะหมายเลข:{" "}
          <select value={tableNumber} onChange={e => setTableNumber(e.target.value)}>
            <option value="">-- เลือกโต๊ะ --</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>โต๊ะ {i + 1}</option>
            ))}
          </select>
        </label>
      </div>

      <h3>รายการเมนู</h3>
      <ul className="menu-list">
        {menu.map(item => {
          const qty = cart.find(c => c.id === item.id)?.quantity || 0;
          return (
            <li key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-image" />
              <span>{item.name}</span>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, qty - 1)} disabled={qty <= 0}>−</button>
                <span className="quantity">{qty}</span>
                <button onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
              </div>
            </li>
          );
        })}
      </ul>

      <h3>ตะกร้าสินค้า</h3>
      {cart.length === 0 ? (
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <table className="cart-table">
          <tbody>
            {cart.map(({ id, name, quantity }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <div className="cart-quantity-control">
                    <button
                      className="cart-quantity-btn minus"
                      onClick={() => updateQuantity(id, quantity - 1)}
                      disabled={quantity <= 0}
                    >
                      −
                    </button>
                    <span className="cart-quantity-display">{quantity}</span>
                    <button
                      className="cart-quantity-btn plus"
                      onClick={() => updateQuantity(id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className="cart-delete-btn"
                    onClick={() => removeItem(id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={submitOrder} className="btn-submit">ยืนยันสั่งอาหาร</button>
      
      
{/* ปุ่มดูคิว */}
<div style={{ textAlign: 'center', marginTop: 20 }}>
  <button 
    onClick={() => setShowQueue(!showQueue)}
    style={{
      padding: '12px 24px',
      background: showQueue 
        ? 'linear-gradient(135deg, #ff6b6b, #ee5a52)' 
        : 'linear-gradient(135deg, #17a2b8, #138496)',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      transform: 'translateY(0)',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    }}
    onMouseDown={(e) => {
      e.target.style.transform = 'translateY(1px)';
    }}
    onMouseUp={(e) => {
      e.target.style.transform = 'translateY(-2px)';
    }}
  >
    <span style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '8px'
    }}>
      <span style={{ fontSize: '18px' }}>
        {showQueue ? '❌' : '🍽️'}
      </span>
      {showQueue ? 'ปิดคิว' : 'ดูคิวออเดอร์'}
    </span>
  </button>
</div>

{/* แสดงคิวเมื่อกดปุ่ม */}
{showQueue && <QueueComponent />}

{message && !showSuccess && (
  <p className="success-message" style={{
    textAlign: 'center',
    padding: '10px 20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    border: '1px solid #c3e6cb',
    margin: '20px auto',
    maxWidth: '400px',
    fontSize: '14px'
  }}>
    {message}
  </p>
)}

{isOrdering && (
  <div className="overlay" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  }}>
    <div className="loader" style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #17a2b8',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
  </div>
)}

      {showSuccess && (
        <div className="order-success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="order-success-content">
            <span className="checkmark">✔️</span>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;