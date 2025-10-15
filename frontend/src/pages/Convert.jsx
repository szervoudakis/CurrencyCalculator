import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/NavBar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Message from "../components/Message.jsx"; //message component
import styles from "../styles/Form.module.css"; // styling reuse
import {useNavigate} from "react-router-dom";
import { getCurrencies } from "../services/currencyService.jsx";

export default function Convert() {
  const { user, logout, token } = useContext(AuthContext);
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  
  // get the currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await getCurrencies(token);
        setCurrencies(res.data);
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setMessage({ text: "Failed to load currencies.", type: "error" });
        if (err.response && err.response.status === 401) {
          logout(); // logout if token is expired
          navigate("/"); // navigate to login
        }
      }
    };
    fetchCurrencies();
  }, [token]);

  // conversion 
  const handleConvert = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setResult(null);

    if (!from || !to || !amount) {
      setMessage({ text: "All fields are required.", type: "error" });
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8080/api/convert?from=${from}&to=${to}&amount=${amount}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // if the backend return empty data send message to inform user
      if (!res.data || !res.data.converted) {
        setMessage({
          text: `No exchange rate found for ${from} → ${to}.`,
          type: "error",
        });
        return;
      }

      setResult(res.data);
      setMessage({ text: "Conversion successful!", type: "success" });
    } catch (err) {
      console.error("Error converting currency:", err);
      setMessage({
        text: "Conversion failed.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Navbar user={user} logout={logout} />

      <div className={styles.form}>
        <h2>Currency Converter</h2>

        <form
          onSubmit={handleConvert}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <select
            className={styles.input}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            <option value="">Select base currency</option>
            {currencies.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Select target currency</option>
            {currencies.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

        <Button label="Convert" variant="primary" type="submit" />
        <Button label="⬅ Back to Home" variant="primary"onClick={() => navigate("/home")}/>
      
        </form>

        <Message type={message.type} text={message.text} />

        {result && (
          <div className={styles.resultBox}>
            <p>
              <strong>{result.amount}</strong> {result.from} =
            </p>
            <h3>
              <strong>{result.converted}</strong> {result.to}
            </h3>
            <p>Rate: {result.rate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
