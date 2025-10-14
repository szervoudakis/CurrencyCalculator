// src/components/Message.jsx
import React from "react";
import styles from "../styles/Message.module.css";
//message component to inform users the result of actions
const Message = ({ type = "success", text }) => {
  if (!text) return null;

  const className =
    type === "error" ? styles.error : styles.success;

  return <div className={`${styles.message} ${className}`}>{text}</div>;
};

export default Message;
