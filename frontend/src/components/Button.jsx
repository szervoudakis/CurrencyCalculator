// src/components/Button.jsx
import React from "react";
import styles from "../styles/Button.module.css";
//this component is Button, which takes variant as a value used for different styles
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
