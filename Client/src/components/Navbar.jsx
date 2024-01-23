import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user } = useContext(UserContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = async () => {
    try {
      // Send a request to the server to logout
      await axios.post("/api/logout");

      // Perform any client-side cleanup, e.g., removing user data from local storage
      localStorage.removeItem("token");

      window.location.href = "/";
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "gray" }}>
        <Toolbar>
          <NavLink style={{ textDecoration: "none", color: "white" }} to="/">
            <MenuItem>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "white", flexGrow: 1 }}
              >
                Home
              </Typography>
            </MenuItem>
          </NavLink>

          <Box
            style={{
              textDecoration: "none",
              color: "white",
              position: "absolute",
              right: "0",
            }}
          >
            <MenuItem>
              <Typography
                variant="h6"
                component="div"
                sx={{ color: "white", flexGrow: 1 }}
              >
                {!!user && <h6>{user.email} </h6>}
              </Typography>

              <MenuItem>
                {!!user?.name && (
                  <Box>
                    <Tooltip title="Account">
                      <IconButton
                        aria-label="user"
                        size="large"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      keepMountedtransformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem>
                        <NavLink
                          to="/dashboard"
                          onClick={handleClose}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          Dashboard
                        </NavLink>
                      </MenuItem>
                      <MenuItem style={{ color: "black" }} onClick={logoutUser}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </MenuItem>
            </MenuItem>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
