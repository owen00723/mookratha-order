const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' })); // อนุญาตให้ทุกโดเมนเข้าถึง API ได้
app.use(express.json()); // Middleware สำหรับอ่าน JSON body ใน request

let orders = []; // Array สำหรับเก็บข้อมูลออเดอร์ทั้งหมด
let nextId = 1;  // ตัวนับ ID สำหรับออเดอร์ใหม่

// Route สำหรับสร้างออเดอร์ใหม่ (POST /orders)
app.post('/orders', (req, res) => {
  const { items, tableNumber } = req.body;

  // ตรวจสอบ tableNumber
  if (typeof tableNumber === 'undefined' || tableNumber === null) {
    console.error('Error: Table number is missing in POST request.');
    return res.status(400).json({ error: 'Table number is required' });
  }
  // ตรวจสอบ items ว่ามี array และไม่ว่าง
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.error('Error: No items or invalid items array in POST request.');
    return res.status(400).json({ error: 'No items to order' });
  }
  // ตรวจสอบว่าแต่ละ item มี quantity ที่ถูกต้อง (>0)
  for (const item of items) {
    if (
      typeof item.quantity !== 'number' ||
      item.quantity <= 0 ||
      !Number.isInteger(item.quantity)
    ) {
      console.error('Error: Invalid quantity in item:', item);
      return res.status(400).json({ error: 'Each item must have a positive integer quantity' });
    }
  }

  const order = {
    id: nextId++,
    tableNumber: Number(tableNumber),
    items, // คาดว่า items มีโครงสร้าง { id, name, quantity }
    status: 'waiting',
    created_at: new Date().toISOString(),
  };
  orders.push(order);

  console.log('New order created and stored:', order);
  res.json({ orderId: order.id });
});

// Route สำหรับดึงออเดอร์ทั้งหมด (GET /orders)
app.get('/orders', (req, res) => {
  console.log('Responding with current orders (IDs):', orders.map(o => ({ id: o.id, tableNumber: o.tableNumber, status: o.status })));
  res.json(orders);
});

// Route สำหรับอัพเดตสถานะออเดอร์ (PUT /orders/:id/status)
app.put('/orders/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const status = req.body.status;

  console.log(`Received PUT request to update status. Order ID: ${id}, New Status: ${status}`);

  const order = orders.find(o => o.id === id);
  if (!order) {
    console.warn(`Order with ID ${id} not found for status update.`);
    return res.status(404).json({ error: 'Order not found' });
  }
  if (!['waiting', 'cooking', 'done'].includes(status)) {
    console.warn(`Invalid status '${status}' received for order ID ${id}.`);
    return res.status(400).json({ error: 'Invalid status' });
  }
  order.status = status;

  console.log(`Order ID ${id} status updated to ${status}.`);
  res.json({ success: true });
});

// Route สำหรับลบออเดอร์ทีละรายการ (DELETE /orders/:id)
app.delete('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Received DELETE request for order ID: ${id}`);

  const initialLength = orders.length;
  orders = orders.filter(o => o.id !== id);

  if (orders.length === initialLength) {
    console.warn(`Order with ID ${id} not found for deletion.`);
    return res.status(404).json({ error: 'Order not found' });
  }

  console.log(`Successfully deleted order ID=${id}. Remaining orders count: ${orders.length}`);
  res.json({ success: true });
});

// Route สำหรับลบออเดอร์ทั้งหมดที่สถานะเป็น 'done' (DELETE /orders)
app.delete('/orders', (req, res) => {
  const initialDoneCount = orders.filter(o => o.status === 'done').length;
  orders = orders.filter(o => o.status !== 'done');

  console.log(`Deleted ${initialDoneCount} done orders. Remaining orders count: ${orders.length}`);
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Endpoints:');
  console.log('  POST   /orders    (Create new order)');
  console.log('  GET    /orders    (Get all orders)');
  console.log('  PUT    /orders/:id/status (Update order status)');
  console.log('  DELETE /orders/:id (Delete single order)');
  console.log('  DELETE /orders    (Delete all done orders)');
});

const path = require('path');

// Serve static React build folder
app.use(express.static(path.join(__dirname, 'build')));

// สำหรับ React Router (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const [queueOrders, setQueueOrders] = useState([]);

useEffect(() => {
  const fetchQueueOrders = async () => {
    try {
      const res = await fetch('https://mookratha-order-1.onrender.com/orders');
      const data = await res.json();
      setQueueOrders(data.filter(order => order.status !== 'done'));
    } catch (error) {
      console.error('ไม่สามารถโหลดคิวออเดอร์:', error);
    }
  };

  fetchQueueOrders();
  const interval = setInterval(fetchQueueOrders, 10000); // อัปเดตทุก 10 วินาที
  return () => clearInterval(interval);
}, []);

