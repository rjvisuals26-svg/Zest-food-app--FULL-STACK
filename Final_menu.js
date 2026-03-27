const express = require('express');
const app = express();
app.use(express.json()); // JSON parsing support

const PORT = 6060;

// --- Q1 & Q2: THE COMPLETE PRODUCT CATALOG (Menu Database) ---
const productCatalog = [
  { id: 101, name: "Zinger Deluxe", price: 750, category: "Fast Food", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
  { id: 102, name: "Grilled BBQ Burger", price: 850, category: "Fast Food", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
  { id: 103, name: "Loaded Cheese Fries", price: 450, category: "Fast Food", img: "https://images.unsplash.com/photo-1585109649139-366815a0d713" },
  { id: 104, name: "Mutton Biryani Special", price: 950, category: "Daily Specials", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0" },
  { id: 105, name: "Garlic Naan (Butter)", price: 80, category: "Daily Specials", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be" },
  { id: 106, name: "Midnight Cold Coffee", price: 550, category: "Drinks", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c" },
  { id: 107, name: "Fresh Mint Lemonade", price: 250, category: "Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd" },
  { id: 108, name: "Chocolate Lava Cake", price: 400, category: "Desserts", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c" },
  { id: 109, name: "Alfredo Pasta", price: 890, category: "Italian", img: "https://images.unsplash.com/photo-1645112481355-813ca3377756" },
  { id: 110, name: "Steak with Mash", price: 1450, category: "Main Course", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092" }
];

// Q1: GET Endpoint for Fetching Menu
app.get('/api/inventory', (req, res) => {
  console.log("📥 [GET] App requested the menu catalog.");
  res.status(200).json(productCatalog);
});

// Q3: POST Endpoint for Order Tracking (The Logger)
app.post('/api/track-order', (req, res) => {
  const incomingOrder = req.body;
  
  console.log("\n--- 🔔 NEW INCOMING ORDER RECEIVED ---");
  console.log("Timestamp:", new Date().toLocaleString());
  console.log("Customer Cart:", incomingOrder.cart);
  console.log("Final Amount: Rs.", incomingOrder.total);
  console.log("--------------------------------------\n");

  res.status(200).send({ status: "Success", message: "Manager logged the order." });
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`✅ Menu & Tracking Server active on: http://localhost:${PORT}`);
  console.log(`🔗 Test Catalog Link: http://localhost:${PORT}/api/inventory`);
});
