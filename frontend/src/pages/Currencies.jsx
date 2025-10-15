import React, {useEffect,useState,useContext} from "react";
import axios from "axios";
import Table from "../components/Table.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Navbar from "../components/NavBar.jsx";
import Loader  from "../components/Loader.jsx";
import Button from "../components/Button.jsx";
import {useNavigate} from "react-router-dom";
import { getCurrencies } from "../services/currencyService.jsx";

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchCurrencies = async (pageNumber = 1) => {
    setLoading(true);//we start new fetch so loading is true
    try {
      const res = await getCurrencies(token, pageNumber, 10);
      setCurrencies(res.data);
      setHasNext(pageNumber * 10 < res.total);
    } catch (err) {
      console.error("Error fetching currencies:", err);
      if (err.response && err.response.status === 401) {
        logout(); // logout if token is expired
        navigate("/"); // navigate to login
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchCurrencies(page);
    }, [token, page]);

  
  if (loading) return <Loader/>;

 return (
  <div style={{ padding: "20px" }}>
    <Navbar user={user} logout={logout} />

    <div style={{ maxWidth: "900px", margin: "0 auto"}}>
      <h2 style={{ margin: "30px 0" }}>Currencies</h2>

      <div style={{ marginBottom: "30px" }}>
        <Table
          columns={["ID", "Name", "Code"]}
          data={currencies}
          type="currency"
        />
      </div>
      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "15px 0" }}>
        <Button
          label="⬅ Previous"
          variant="secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} //set page with prev-1 num
          disabled={page === 1}
        />
        <span style={{ alignSelf: "center" }}>Page {page}</span>

        <Button
          label="Next ➡"
          variant="secondary"
          onClick={() => setPage((prev) => prev + 1)}  //set the next page with prev+1 num
          disabled={!hasNext}
        />
      </div>
      <div style={{ display: "flex" }}>
        <Button
          label="⬅ Back to Home"
          variant="success"
          onClick={() => navigate("/home")}
        />
      </div>
    </div>
  </div>
);

}