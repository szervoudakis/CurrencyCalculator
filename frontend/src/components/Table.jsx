//src/componerts/Table.jsx

import React from "react";
import styles from "../styles/Table.module.css";

export default function Table ({columns = [], data = []}){

  if(data.length==0){
    return <p className={styles.noData}>No data available</p>;
  }

   return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>{row[col.toLowerCase()] ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}