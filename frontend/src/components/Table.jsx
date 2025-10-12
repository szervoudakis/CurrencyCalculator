import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import styles from "../styles/Table.module.css";

export default function Table({ columns = [], data = [], type = "currency" }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <p className={styles.empty}>No data available.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
        
            {columns.map((col) => {
              const key = col.toLowerCase();
              return <td key={key}>{item[key]}</td>;
            })}

            <td className={styles.actions}>
              {type === "currency" && (
                <Button
                  label="Edit"
                  variant="primary"
                  onClick={() => navigate(`/edit-currency/${item.id}`)}
                />
              )}

              {type === "exchange" && (
                <Button
                  label="Edit Rate"
                  variant="primary"
                  onClick={() => navigate(`/edit-exchange-rate/${item.id}`)}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
