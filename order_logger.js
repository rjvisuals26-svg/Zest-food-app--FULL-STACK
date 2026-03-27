const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 8081; 

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>✅ Order Logger is Active!</h1>
            <p>Waiting for orders from your React Native App...</p>
            <p style="color: #666;">Check your terminal to see incoming order details.</p>
        </div>
    `);
});

// 2. Q3: The "Order Logger" (POST Endpoint)
// Ye wo jagah hai jahan React Native data bhejta hai
app.post('/place-order', (req, res) => {
    const orderData = req.body;

    console.log("=========================================");
    console.log("📢 MANAGER NOTIFICATION: New Order Received!");
    console.log("-----------------------------------------");
    console.log("Order ID:      ", orderData.orderId);
    console.log("Items Ordered: ", orderData.itemsList);
    console.log("Total Bill:    Rs.", orderData.totalBill);
    console.log("Delivery To:   ", orderData.deliveryLocation);
    console.log("=========================================\n");

    // Frontend ko confirmation bhejna
    res.status(200).send({ 
        status: "Success", 
        message: "Order logged in Manager Terminal!" 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING: http://localhost:${PORT}`);
    console.log(`📱 App should send POST requests to: http://localhost:${PORT}/place-order`);
});
