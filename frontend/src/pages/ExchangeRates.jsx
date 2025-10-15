import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.jsx";
import Table from "../components/Table.jsx";
import Button from "../components/Button.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { getExchangeRates } from "../services/exchangeRateService.jsx";
import Loader from "../components/Loader.jsx";

export default function ExchangeRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchRates = async (pageNumber) => {
    setLoading(true);  //we start new fetch
    try {
      const res = await getExchangeRates(token, pageNumber, 10);
      setRates(res.data);
      setHasNext(pageNumber * 10 < res.total);
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
      if (err.response && err.response.status === 401) {
        logout(); // logout if token is expired
        navigate("/"); // navigate to login
      }
    } finally {
      setLoading(false); //end fetch hide loader
    }
  };

  useEffect(() => {
    fetchRates(page);
  }, [token, page]);

  if (loading) return <Loader/>;

  return (
    <div>
      <Navbar user={user} logout={logout} />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Exchange Rates</h2>
       {/** we want to create table with these specs */}
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

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "15px 0" }}>
        <Button
          label="⬅ Previous"
          variant="secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        />
        <span style={{ alignSelf: "center" }}>Page {page}</span>
        <Button
          label="Next ➡"
          variant="secondary"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasNext}
        />
      </div>

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
