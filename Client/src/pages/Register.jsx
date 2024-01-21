import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button, Card, TextField, Typography } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const { data } = await axios.post("/api/register", {
        name,
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Account Created. Welcome!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="full-screen bg-createAccount">
      <Card sx={{ padding: "10px" }}>
        <form onSubmit={registerUser}>
          <Typography variant="h4">Create Account</Typography>

          <TextField
            type="text"
            label="Name"
            sx={{ margin: 1 }}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <TextField
            type="email"
            label="Email"
            sx={{ margin: 1 }}
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <TextField
            type="password"
            label="Password"
            sx={{ margin: 1 }}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button type="submit" variant="contained" sx={{ margin: 2 }}>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
