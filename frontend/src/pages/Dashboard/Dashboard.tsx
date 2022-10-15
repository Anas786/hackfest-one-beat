import React from "react";
import "./Dashboard.css";
import { CounterCard } from "./Components/CounterCard";

export const Dashboard = () => {
  return (
    <div>
      <div className="dashboard-stats">
        <CounterCard label="Total Admissions" value="356,785K" />
        <CounterCard label="Total Patients" value="987,459" />
        <CounterCard label="Total Transfers" value="458,77" />
        <CounterCard label="Todays Appointments" value="25,00" />
      </div>
    </div>
  );
};
