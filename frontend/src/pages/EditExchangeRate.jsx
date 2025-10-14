import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar.jsx";
import Form from "../components/Form.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message.jsx";
import Button from "../components/Button.jsx";
import { deleteExchangeRate, getExchangeRateById, updateExchangeRate } from "../services/exchangeRateService.jsx";

export default function EditExchangeRate() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [exchangeRate, setExchangeRate] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  
  //get exchange rate by id
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const data = await getExchangeRateById(id,token);
        setExchangeRate(data);
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setMessage({ text: "Failed to load exchange rate.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRate();
  }, [id, token]);

  // update rate function
  const handleUpdate = async (data) => {
    try {
      await updateExchangeRate(id,data,token);
      setMessage({ text: "Exchange rate updated successfully!", type: "success" });
      setTimeout(() => navigate("/exchange-rates"), 1200);
    } catch (err) {
      console.error("Error updating exchange rate:", err);
      setMessage({ text: "Failed to update exchange rate.", type: "error" });
    }
  };

  const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this exchange rate?")) return;
  
      try {
        await deleteExchangeRate(id,token);
        // alert("Exchange Rate deleted successfully!");
        setMessage({ text: "Exchange Rate deleted successfully!", type: "success" });
        navigate("/exchange-rates");
      } catch (err) {
        console.error("Error deleting currency:", err);
        // alert("Failed to delete currency.");
        setMessage({ text: "Failed to delete currency.", type: "error" });
      }
  };

  if (loading) return <p>Loading exchange rate...</p>;
  if (!exchangeRate) return <p>Exchange rate not found.</p>;

  // init fields for form
  const fields = [
    {
      name: "baseCurrency",
      label: exchangeRate.base.code,
      type: "text",
      defaultValue: exchangeRate.baseCurrency?.code || "",
      disabled: true, 
    },
    {
      name: "targetCurrency",
      label: exchangeRate.target.code,
      type: "text",
      defaultValue: exchangeRate.targetCurrency?.code || "",
      disabled: true,
    },
    {
      name: "rate",
      label: "Exchange Rate",
      type: "number",
      required: true,
      step:"0.01",
      defaultValue: exchangeRate.rate,
      validate: (value) =>
        parseFloat(value) > 0 || "Rate must be greater than 0",
    },
  ];

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <Message type={message.type} text={message.text} />
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Form fields={fields} mode="update" onSubmit={handleUpdate} />
        <Button
          label="Back to Exchange Rates"
          variant="secondary"
          onClick={() => navigate("/exchange-rates")}
        />

        <Button
          label="Delete Exchange Rate"
          variant="danger"
          onClick={handleDelete}
        />
        
      </div>
    </div>
  );
}
