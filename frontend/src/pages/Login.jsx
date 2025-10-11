import { useState } from "react";
import axios from "axios";
import Button from "../components/Button.jsx";
import Message from "../components/Message.jsx";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post("/api/login", { username, password });
      console.log("Login success:", res.data);
      setMessage({ text: "Login successful!", type: "success" });
    } catch {
      setMessage({ text: "Invalid credentials", type: "error" });
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <Message type={message.type} text={message.text} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" label="Login" />
        <p style={{ marginTop: "10px" }}>
  Don’t have an account?{" "}
  <a href="/register" style={{ color: "#0078ff" }}>
    Register here
  </a>
</p>
      </form>
    </div>
  );
}
