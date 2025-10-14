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
```bash
git clone https://github.com/your-username/currency-calculator.git
cd currency-calculator

2️⃣ Start Docker containers

docker compose up --build

3️⃣ Backend setup

docker exec -it symfony_php bash
composer install
php bin/console doctrine:migrations:migrate

4️⃣ Frontend setup
docker exec -it react_frontend bash
npm install

🧩 API Overview
Endpoint	Method	Description	Auth Required
/api/login	POST	User login	❌
/api/register	POST	User registration	❌
/api/currencies	GET	List currencies	✅
/api/currencies	POST	Create currency	✅
/api/exchange-rates	GET	List exchange rates	✅
/api/convert	GET	Convert currency	✅
👤 Authentication

The API uses JWT tokens.
After logging in, the token is stored in the browser and automatically attached to protected requests.

🧪 Testing

Run backend tests with:

php bin/phpunit
