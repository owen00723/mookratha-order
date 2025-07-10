import React, { useState } from 'react';
import './OrderPage.css';

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

      {message && !showSuccess && <p className="success-message">{message}</p>}

      {isOrdering && (
        <div className="overlay">
          <div className="loader"></div>
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
