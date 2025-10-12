import { useState, useContext } from "react";
import axios from "axios";
import Button from "../components/Button.jsx";
import Message from "../components/Message.jsx";
import styles from "../styles/Login.module.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });


    try {
      const res = await axios.post("/api/login", { username, password });
      
      const token = res.data.token; // JWT returns symfony
      if(!token){
         setMessage({text:"invalid response from server", type: "error"});
         return ;
      }
      login(token, { username });
      setTimeout(() => {
      navigate("/home");
    }, 800);
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
