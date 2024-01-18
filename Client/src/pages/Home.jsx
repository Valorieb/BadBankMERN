import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Card
        style={{
          background: "linear-gradient(to right, gray, black)",
          width: "30rem",
          padding: "10px",
          margin: "auto",
          color: "white",
        }}
      >
        <CardMedia
          image="/images/bank_heist1.jpg"
          title="bank heist"
          sx={{ height: 500 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Welcome to Bad Bank!
          </Typography>
          <Typography>
            A really bad bank. We practically invite robbers to steal from you.
            What? Not a fan of a good heist?
          </Typography>
          <Box textAlign="center">
            <Button variant="contained" href="/login" sx={{ margin: "20px" }}>
              Sign in
            </Button>

            <Typography>Or </Typography>
            <NavLink
              to="/register"
              style={{
                color: "pink",
                textDecoration: "none", // Remove default underline
              }}
              activestyle={{ color: "#e0f7fa" }}
            >
              Create an account
            </NavLink>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
