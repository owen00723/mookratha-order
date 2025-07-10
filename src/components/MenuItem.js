import React from 'react';

export default function MenuItem({ item, onAdd }) {
  return (
    <div className="border rounded p-3 mb-2 flex justify-between items-center">
      <span>{item.name} - {item.price} บาท</span>
      <button
        className="bg-green-500 text-white px-3 py-1 rounded"
        onClick={() => onAdd(item)}
      >
        เพิ่ม
      </button>
    </div>
  );
}
