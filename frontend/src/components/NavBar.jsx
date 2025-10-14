import React from "react";
import styles from "../styles/Home.module.css"; 
import  Button  from "./Button.jsx";
//reusable component NavBar , because we want to use navigation bar in multiple pages
function Navbar({ user, logout }) {
  return (
    <nav className={styles.navbar}>
      <h2>
        Currency Dashboard <span>{user.username}</span>
      </h2>

      <div className={styles.navRight}>
        <Button label="Logout" variant="danger" onClick={logout} />
      </div>
    </nav>
  );
}

export default Navbar;
