import React, {useEffect,useState,useContext} from "react";
import axios from "axios";
import Table from "../components/Table.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/NavBar.jsx";
import Loader  from "../components/Loader.jsx";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/currencies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrencies(res.data.data);
      } catch (err) {
        console.error("Error fetching currencies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, [token]);

  if (loading) return <Loader/>;

   return (
    <div>
      <Navbar user={user} logout={logout} />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Currencies</h2>
      <Table
        columns={["ID", "Name", "Code", "View"]}
        data={currencies}
      />
    </div>
  );
}