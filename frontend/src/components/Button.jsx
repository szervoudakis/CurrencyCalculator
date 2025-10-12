// src/components/Button.jsx
import React from "react";
import styles from "../styles/Button.module.css";

const Button = ({ type = "button", label, onClick, variant = "primary" }) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} mt-3`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};


export default Button;
