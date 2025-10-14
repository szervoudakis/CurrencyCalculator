import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar.jsx";
import Form from "../components/Form.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import Button from "../components/Button.jsx";
import { getCurrencies } from "../services/currencyService.jsx";
import { createExchangeRate } from "../services/exchangeRateService.jsx";

export default function AddExchangeRate() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  // create fields for the Form component
  const fields = [
    {
      name: "baseCurrency",
      label: "Base Currency",
      type: "select",
      required: true,
      options: currencies.map((c) => ({
        value: c.id,
        label: `${c.code} - ${c.name}`,
      })),
    },
    {
      name: "targetCurrency",
      label: "Target Currency",
      type: "select",
      required: true,
      options: currencies.map((c) => ({
        value: c.id,
        label: `${c.code} - ${c.name}`,
      })),
    },
    {
      name: "rate",
      label: "Exchange Rate",
      type: "number",
      step:"0.01",
      required: true,
      validate: (value) =>
        parseFloat(value) > 0 || "Rate must be greater than 0",
    },
  ];

  useEffect(() => {
    //fetch all currencies for dropdown lists
    const fetchCurrencies = async () => {
      try {
        const res = await getCurrencies(token);
        setCurrencies(res.data);
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setMessage({ text: "Failed to load currencies", type: "error" });
      }
    };
    fetchCurrencies();
  }, [token]);

  
  // Handle Submit New Rate
  const handleAddRate = async (data) => {
    if (data.baseCurrency === data.targetCurrency) {
      setMessage({
        text: "Base and target currencies must be different",
        type: "error",
      });
      return;
    }

    try {
      await createExchangeRate(data,token);
      setMessage({ text: "Exchange rate added successfully!", type: "success" });
      setTimeout(() => navigate("/exchange-rates"), 1000);
    } catch (err) {
      console.error("Error adding exchange rate:");
      if(err.response && err.response.status===409) {
        setMessage({
          text: "This exchange rate already exists.  Please try with other currencies",
          type: "error",
        });
      }else{
        setMessage({
            text: "Failed to add exchange rate. Please try again later.",
            type: "error",
        });
      }
    }
  };

  return (
    <div>
      <Navbar user={user} logout={logout} />

      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Message type={message.type} text={message.text} />
        <Form fields={fields} mode="add" onSubmit={handleAddRate} />
        <Button label="⬅ Back to Home" variant="success" onClick={() => navigate("/home")}/>
      </div>
    </div>
  );
}
