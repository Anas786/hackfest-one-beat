import { Button, Result } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/login"), 3000);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist. Redirecting in 3 seconds"
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  );
};
