# 🛒 QuickBasket — Full-Stack Grocery Delivery Platform

QuickBasket is a full-stack grocery delivery platform built with **Next.js, TypeScript, MongoDB, Redux Toolkit, NextAuth, Socket.io, Tailwind CSS, and Cloudinary**.

The application supports three major roles — **Customer, Admin, and Delivery Partner** — with real-time order updates, live delivery tracking, chat, OTP-based delivery verification, authentication, and complete order management.

---

## ✨ Features

### 👤 Customer

* User registration and authentication
* Google OAuth login
* Browse grocery products
* Search and explore products
* Add/remove items from cart
* Update product quantities
* Checkout and delivery address management
* Place grocery orders
* Track order status
* Live delivery tracking
* Real-time chat with delivery partner
* OTP-based delivery verification
* Responsive customer dashboard

### ⚙️ Admin

* Secure admin dashboard
* Add grocery products
* Upload product images using Cloudinary
* View and manage products
* Manage customer orders
* Monitor delivery workflow
* Manage delivery-related operations
* Dashboard statistics and application overview

### 🚚 Delivery Partner

* Delivery partner dashboard
* Receive available delivery assignments
* Accept orders
* View assigned deliveries
* Live location tracking
* Communicate with customers using real-time chat
* Verify delivery using OTP
* Mark orders as delivered
* Track delivery statistics and earnings

---

## ⚡ Real-Time Features

QuickBasket uses **Socket.io** for real-time communication between customers, delivery partners, and the application.

Real-time functionality includes:

* Delivery assignment events
* Live order status updates
* Customer ↔ Delivery Partner messaging
* Live delivery location updates
* Delivery workflow synchronization

MongoDB is used as the persistent data layer, while Socket.io handles real-time event delivery.

---

## 🔐 Authentication & Security

Authentication is implemented using **NextAuth / Auth.js**.

Supported authentication methods include:

* Credentials authentication
* Google OAuth
* Secure user sessions
* Protected routes
* Role-based access control

The application includes separate flows for:

* Customers
* Administrators
* Delivery partners

Sensitive credentials and API keys are stored using environment variables and are never exposed directly in client-side code.

---

## 📍 Live Delivery Tracking

QuickBasket includes a live delivery tracking system using maps and browser geolocation.

The delivery workflow allows:

1. A delivery partner to accept an order
2. The application to track their current location
3. The customer to monitor delivery progress
4. Location information to update during delivery
5. Delivery to be completed using OTP verification

---

## 💬 Real-Time Chat

Customers and delivery partners can communicate directly during an active delivery.

The messaging system uses **Socket.io** to provide fast real-time communication.

This helps customers coordinate with delivery partners without leaving the application.

---

## 🔐 OTP Delivery Verification

To prevent incorrect delivery completion, QuickBasket uses an OTP verification flow.

Typical flow:

```text
Customer places order
        ↓
Delivery partner accepts order
        ↓
Order is delivered
        ↓
OTP is sent to customer
        ↓
Customer shares OTP
        ↓
Delivery partner verifies OTP
        ↓
Order marked as Delivered
```

---

## 🧠 AI Integration

QuickBasket also includes AI-powered functionality using the **Gemini API** to improve the user experience and provide intelligent assistance where required.

---

## 🛠 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux Toolkit
* Lucide React

### Backend

* Next.js Route Handlers / API Routes
* Node.js
* REST APIs
* Socket.io

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Authentication

* NextAuth / Auth.js
* Google OAuth
* Credentials Authentication

### Storage & External Services

* Cloudinary
* Gemini API
* Nodemailer
* OpenStreetMap / Leaflet

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🏗 Architecture

```text
                         ┌─────────────────────┐
                         │      CUSTOMER       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      NEXT.JS UI     │
                         │ React + TypeScript  │
                         └──────────┬──────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │ Next.js APIs │ │   Socket.io  │ │   NextAuth   │
           │ REST Routes  │ │ Real-Time    │ │    Auth      │
           └──────┬───────┘ └──────┬───────┘ └──────────────┘
                  │                │
                  ▼                ▼
           ┌──────────────┐ ┌──────────────┐
           │   MongoDB    │ │Socket Server │
           │   Mongoose   │ │              │
           └──────────────┘ └──────────────┘

              ▲                         ▲
              │                         │
      ┌───────┴─────────┐      ┌────────┴─────────┐
      │      ADMIN      │      │ DELIVERY PARTNER │
      └─────────────────┘      └──────────────────┘
```

---

## 📁 Project Structure

This repository contains two main applications:

```text
quickbasket-food-delivery-web/
│
├── quickbasket/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── model/
│   ├── redux/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── socketserver/
│   ├── server files
│   ├── package.json
│   └── ...
│
└── README.md
```

### `quickbasket/`

Contains the main **Next.js full-stack application**, including:

* Frontend UI
* Authentication
* API routes
* MongoDB integration
* Customer dashboard
* Admin dashboard
* Delivery partner dashboard

### `socketserver/`

Contains the separate **Socket.io server** responsible for real-time communication and delivery events.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/raihan-web-dev6/quickbasket-food-delivery-web.git
```

Move into the project:

```bash
cd quickbasket-food-delivery-web
```

---

## 📦 Install Next.js Dependencies

```bash
cd quickbasket
npm install
```

---

## 🔌 Install Socket Server Dependencies

Open another terminal:

```bash
cd socketserver
npm install
```

---

## 🔑 Environment Variables

Create an `.env.local` file inside the appropriate application directory.

Example:

```env
MONGODB_URI=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

EMAIL_USER=
EMAIL_PASS=
```

Depending on your deployment and Socket.io configuration, you may also need a socket server URL such as:

```env
NEXT_PUBLIC_SOCKET_URL=
```

> ⚠️ Never commit real API keys, passwords, database credentials, or secrets to GitHub.

---

## ▶️ Run the Next.js Application

Inside the `quickbasket` folder:

```bash
npm run dev
```

The application will normally run at:

```text
http://localhost:3000
```

---

## 🔌 Run the Socket.io Server

Inside the `socketserver` folder:

```bash
npm run dev
```

or, depending on the configured script:

```bash
npm start
```

---

## 🌐 Core Application Flow

```text
User Login
   ↓
Browse Groceries
   ↓
Add to Cart
   ↓
Checkout
   ↓
Place Order
   ↓
Delivery Assignment
   ↓
Delivery Partner Accepts
   ↓
Live Tracking + Chat
   ↓
OTP Verification
   ↓
Order Delivered
```

---

## 🎯 What I Learned

Building QuickBasket helped me strengthen my understanding of:

* Full-stack application architecture
* Next.js App Router
* Authentication and authorization
* REST API development
* MongoDB data modeling
* Redux Toolkit state management
* Real-time communication with Socket.io
* Live location tracking
* Role-based application design
* Cloudinary file uploads
* OTP verification workflows
* Responsive frontend development
* Production deployment
* Debugging frontend/backend communication

---

## 🔮 Future Improvements

Potential improvements include:

* Online payment integration
* Push notifications
* Improved delivery route optimization
* Advanced admin analytics
* Redis caching
* Background jobs and queues
* Automated testing
* Improved real-time scalability
* Progressive Web App support

---

## 👨‍💻 Author

### Raihan Tariq

**Full Stack Developer | MERN | Next.js | AI Applications**

* 🌐 Portfolio: https://raihandev.vercel.app/
* 💼 LinkedIn: https://www.linkedin.com/in/raihan-full-stack-developer
* 💻 GitHub: https://github.com/raihan-web-dev6
* 📧 Email: [raihan.webdev6@gmail.com](mailto:raihan.webdev6@gmail.com)

---

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐.

Feedback, suggestions, and code reviews are always welcome.

---

## 📄 Repository

https://github.com/raihan-web-dev6/quickbasket-food-delivery-web
#   m y g r e e n d e l i g h t  
 