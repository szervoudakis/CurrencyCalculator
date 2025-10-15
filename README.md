# 💱 Currency Calculator (Symfony + React)

This project is a full-stack currency calculator application built with **Symfony (PHP)** for the backend and **React (Vite)** for the frontend.  
It allows users to register, log in, and manage currencies and exchange rates securely through REST API endpoints.

---

## 🚀 Features

- User Authentication (JWT)
- CRUD operations for **Currencies** and **Exchange Rates**
- Currency conversion (with caching and async logic)
- Rate limiting (via Nginx)
- Clean MVC + Service Layer Architecture
- Frontend built with **React + Axios + React Hook Form**
- Protected routes using **AuthContext**
- Dockerized environment (Nginx, PHP-FPM, MySQL, React)

---

## 🧱 Tech Stack

**Backend:**
- PHP 8.3, Symfony 7
- MySQL 8
- JWT Authentication (`lexik/jwt-authentication-bundle`)
- Symfony Cache, Messenger (async handling)
- PHPUnit (Unit & Integration Tests)

**Frontend:**
- React (Vite)
- Axios
- React Hook Form
- Context API (Auth)
- CSS Modules

**Dev Tools:**
- Docker + Docker Compose
- Nginx
- Composer
- Node.js & npm

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

git clone https://github.com/your-username/currency-calculator.git

cd currency-calculator

------------------------------------------------------------------

###  2️⃣ Start Docker containers

docker compose up --build

------------------------------------------------------------------
###  3️⃣ Backend setup

docker exec -it symfony_php bash

composer install

php bin/console doctrine:migrations:migrate

-------------------------------------------------------------------
###  4️⃣ Frontend setup

docker exec -it react_frontend bash

npm install

-------------------------------------------------------------------

📘 Note about the Database

The database starts empty after the initial setup.  

You can add sample data manually using the API or the frontend interface.  

For example:

1️⃣ Login via the UI to get a JWT token.

2️⃣ Use the **Add Currency** and **Add Exchange Rate** pages to insert data.

3️⃣ After that, you can use the **Convert** feature normally.