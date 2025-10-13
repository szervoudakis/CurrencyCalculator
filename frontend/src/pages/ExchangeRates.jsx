import React, {useEffect,useState,useContext} from "react";
import axios from "axios";
import Table from "../components/Table.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/NavBar.jsx";
import Loader  from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import {useNavigate} from "react-router-dom";

export default function ExchangeRates(){
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/exchange-rates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRates(res.data.data);
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Exchange Rates</h2>

      <Table
        columns={["ID", "Base", "Target", "Rate"]}
        data={rates.map((r) => ({
          id: r.id,
          base: r.base,
          target: r.target,
          rate: r.rate,
        }))}
         type="exchange"
      />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <Button
          label="⬅ Back to Home"
          variant="success"
          onClick={() => navigate("/home")}
        />
      </div>

    </div>
  );
}