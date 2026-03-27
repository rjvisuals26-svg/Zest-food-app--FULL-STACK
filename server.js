const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());


app.post('/place-order', (req, res) => {
    
    console.log("Raw Data Received:", req.body); 

    const { orderId, itemsList, totalBill, deliveryLocation } = req.body; 
    
    console.log("\n********** NEW ORDER RECEIVED **********");
    console.log(`Order ID:  ${orderId}`);
    console.log(`Items:     ${itemsList}`);
    console.log(`Total:     Rs. ${totalBill}`);
    console.log(`Address:   ${deliveryLocation}`);
    console.log("****************************************\n");

    res.status(200).send({ message: "Success" });
});

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
    console.log("Waiting for orders from your React Native app...");
});
