// src/pages/Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import styles from "../styles/Home.module.css";
import Navbar from "../components/NavBar.jsx";
import Loader from "../components/Loader.jsx";

export default function Home() {
  const { user, logout,loading } = useContext(AuthContext);
  if(loading){
     return <Loader/>
  }

  if (!user) {
    return (
      <div className={styles.unauthorized}>
        <h2>Access denied</h2>
        <p>You must be logged in to view this page.</p>
        <a href="/" className={styles.link}>Go to Login</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar user={user} logout={logout} />

      <main className={styles.main}>
        <h3>Manage Currencies</h3>
        <ul className={styles.menu}>
         <a href="/currencies">💱 View Currencies</a>
         <a href="/exchange-rates">📈 Exchange Rates</a>
         <a href="/add-currency">➕ Add Currency</a>
         <a href="/add-exchange-rates">➕ Add Exchange Rates</a>
         <a href="/convert">🔄 Convert</a>
        </ul>
      </main>
    </div>
  );
}
