import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextField, Typography } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="full-screen bg-login">
      <Card sx={{ padding: "10px" }}>
        <form onSubmit={loginUser}>
          <Typography variant="h4">Sign in</Typography>
          <TextField
            label="Email"
            sx={{ margin: 1 }}
            type="text"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <TextField
            label="Password"
            sx={{ margin: 1 }}
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button type="submit" variant="contained" sx={{ margin: 2 }}>
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}
