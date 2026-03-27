# Food App Backend & Frontend Integration

This project demonstrates a full-stack integration for a food delivery application. It includes a multi-port backend architecture and a React Native frontend.

## 🚀 Project Components

**1. Menu Server (Port 6060)**
* **Task:** Provides a JSON catalog of food items.
* **Data Structure:** Each item includes `id`, `name`, `price`, `category`, and a visual image URL.
* **Endpoint:** `GET http://localhost:6060/api/inventory`
* **File:** `Final_menu.js`

**2. Order Logger Service (Port 5050 / 8080)**
* **Task:** Acts as a receiver for incoming orders.
* **Functionality:** Receives POST requests from the mobile app and prints real-time order details to the terminal.
* **Endpoint:** `POST /place-order`
* **Files:** `order_logger.js` (Port 8080) and `server.js` (Port 5050).

**3. Mobile Frontend (React Native)**
* Utilizes the native `fetch` API to connect with both backend services.
* Successfully handles real-time data transmission and state management.

## 🛠️ How to Run

1. **Clone the repository:** `git clone [Your Repository Link Here]`
2. **Start the Menu Server:** Run `node Final_menu.js`
3. **Start the Order Logger:** Run `node server.js` (or `node order_logger.js` for readiness validation)
4. **Run the App:** Ensure your Static IP address (e.g., 192.168.1.109) is updated in your fetch requests to bypass localhost limitations, and run your Expo project.

## ✅ Deliverables Checklist
* [x] Single Server files for Menu & Logging.
* [x] Web-based Image URLs (Visual Catalog).
* [x] Terminal Logging for Order confirmation.
* [x] Documentation with screenshots (PDF).
