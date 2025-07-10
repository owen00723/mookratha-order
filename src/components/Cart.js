import React from 'react';

export default function Cart({ cartItems, onRemove }) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mt-5 border p-4 rounded">
      <h2 className="text-lg font-bold mb-3">🛒 ตะกร้าของคุณ</h2>
      {cartItems.length === 0 ? (
        <p>ไม่มีรายการ</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between my-1">
                {item.name} - {item.price} บาท
                <button className="text-red-500" onClick={() => onRemove(index)}>ลบ</button>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold">รวม: {total} บาท</p>
        </>
      )}
    </div>
  );
}
