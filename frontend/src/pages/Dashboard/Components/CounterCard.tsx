import React from "react";
import { Card, Typography } from "antd";

interface ICounterCard {
  label: string;
  value: string;
}

export const CounterCard = ({ label, value }: ICounterCard) => {
  return (
    <Card
      style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "250px" }}
    >
      <Typography>{label}</Typography>
      <Typography>{value}</Typography>
    </Card>
  );
};
