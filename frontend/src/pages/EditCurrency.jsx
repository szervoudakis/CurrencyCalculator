import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import Form from "../components/Form.jsx";
import Button from "../components/Button.jsx";
import Message from "../components/Message.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { deleteCurrency, getCurrencyById, updateCurrency } from "../services/currencyService.jsx";

export default function EditCurrency() {
  const { token, user, logout } = useContext(AuthContext);
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [currency, setCurrency] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);

  // Fetch currency by ID function
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const data = await getCurrencyById(id,token);
        setCurrency(data);
      } catch (err) {
        console.error("Error fetching currency:", err);
        setMessage({ text: "Failed to load currency.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
  }, [id, token]);

  //Update currency function
  const handleUpdate = async (data) => {
    try {
      await updateCurrency(id,data,token);
      setMessage({ text: "Currency updated successfully!", type: "success" });
      setTimeout(() => navigate("/currencies"), 1000);
    } catch (err) {
      console.error("Error updating currency:", err);
      setMessage({ text: "Failed to update currency.", type: "error" });
    }
  };

  //Delete currency function
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this currency?")) return;

    try {
      await deleteCurrency(id,token);
      alert("Currency deleted successfully!");
      navigate("/currencies");
    } catch (err) {
      console.error("Error deleting currency:", err);
      alert("Failed to delete currency.");
    }
  };

  if (loading) return <p>Loading currency data...</p>;
  if (!currency) return <p>Currency not found.</p>;

  //Pre-fill form fields
  const fields = [
    {
      name: "name",
      label: "Currency Name",
      type: "text",
      required: true,
      placeholder: "Enter currency name",
      defaultValue: currency.name,
    },
    {
      name: "code",
      label: "Currency Code",
      type: "text",
      required: true,
      minLength: 3,
      placeholder: "Enter currency code",
      defaultValue: currency.code,
    },
  ];

  return (
    <div>
      <Navbar user={user} logout={logout} />
   
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
         <Message type={message.type} text={message.text} />
        <Form fields={fields} mode="update" onSubmit={handleUpdate} />
        
        <Button
          label="Back To Currencies"
          variant="success"
          onClick = {() => navigate("/currencies")}
        />

        <Button
          label="Delete Currency"
          variant="danger"
          onClick={handleDelete}
        />
        
      </div>
    </div>
  );
}
