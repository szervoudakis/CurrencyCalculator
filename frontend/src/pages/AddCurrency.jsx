import React, { useState,useContext } from "react";
import axios from "axios";
import Navbar from "../components/NavBar.jsx";
import Form from "../components/Form.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import Button from "../components/Button.jsx";
import { addCurrency } from "../services/currencyService.jsx";

export default function AddCurrency() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });
  const fields = [
    { name: "name", label: "Currency Name", required: true },
    { name: "code", label: "Currency Code", required: true, minLength: 3 },
  ];

  const handleAddCurrency = async (data) => {
    try {
      await addCurrency(data, token);
      setMessage({text:"Currency Added Successfully", type: "success"});
      navigate("/currencies");
    } catch (err) {
      console.error("Error adding currency:", err);
      setMessage({text:"Failed to add currency.", type: "error"});
    }
  };

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <Message type={message.type} text={message.text} />
      <Form fields={fields} mode="add" onSubmit={handleAddCurrency} />
      <Button
          label="⬅ Back to Home"
          variant="success"
          onClick={() => navigate("/home")}
        />
    </div>
  );
}
