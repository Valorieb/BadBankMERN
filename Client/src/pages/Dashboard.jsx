import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { NumberInputAdornments } from "../components/NumberInputAdornments";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function Dashboard() {
  const { user, fetchBalance, fetchName, fetchEmail, updateBalance } =
    useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = React.useState(false);
  const [depositOpen, setDepositOpen] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState("");
  const [deposit, setDeposit] = React.useState("");

  const fetchBalanceData = async () => {
    try {
      await fetchBalance();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error fetching balance. Please try again.");
      setLoading(false);
    }
  };

  const fetchNameData = async () => {
    try {
      await fetchName();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching name:", error);
      toast.error("Error fetching name. Please try again.");
      setLoading(false);
    }
  };

  const fetchEmailData = async () => {
    try {
      await fetchEmail();
      setLoading(false);
    } catch (error) {
      console.error("Error fetching email:", error);
      toast.error("Error fetching email. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNameData();
    fetchEmailData();
    fetchBalanceData();
  }, []);

  const handleClickOpenWithdraw = () => {
    setWithdrawOpen(true);
  };

  const handleClickOpenDeposit = () => {
    setDepositOpen(true);
  };

  const handleClose = () => {
    setWithdrawOpen(false);
    setDepositOpen(false);
  };

  const handleWithdrawInputChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      toast.error("Please enter a valid numeric value for withdrawal.");
      return;
    }
    const numericValue = Number(value);

    if (numericValue > user.balance) {
      console.error("Invalid withdrawal amount:", numericValue);
      toast.error("Withdrawal amount must not exceed balance.");
      setWithdraw("");
      return;
    }

    setWithdraw(value);
  };

  const handleDepositInputChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      toast.error("Please enter a valid numeric value for deposit.");
      return;
    }
    setDeposit(value);
  };

  const handleDeposit = () => {
    const depositAmount = parseInt(deposit, 10);

    if (isNaN(deposit) || deposit <= 0) {
      toast.error("Invalid deposit amount. Please enter a positive number.");
      return;
    }

    axios
      .post(
        "/api/deposit",
        { amount: depositAmount },
        { withCredentials: true }
      )
      .then((response) => {
        const newBalance = response.data.balance;
        updateBalance(newBalance);
        toast.success("Deposit successful!");
      })
      .catch((error) => {
        console.error("Error depositing:", error);
        toast.error("Error depositing. Please try again.");
      });

    handleClose();
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseInt(withdraw, 10);

    if (
      !isNaN(withdrawAmount) &&
      withdrawAmount >= 0 &&
      withdrawAmount <= user.balance
    ) {
      axios
        .post(
          "/api/withdraw",
          { amount: withdrawAmount },
          { withCredentials: true }
        )
        .then((response) => {
          const newBalance = response.data.balance;
          updateBalance(newBalance);
          toast.success("Withdrawal successful!");
        })
        .catch((error) => {
          console.error("Error withdrawing:", error);
          toast.error("Error withdrawing. Please try again.");
        });
    }

    handleClose();
  };

  return (
    <>
      {!loading && (
        <Card sx={{ padding: "20px" }}>
          <Typography variant="h1">Dashboard</Typography>

          {!!user && <Typography variant="h2">Hi {user.name}! </Typography>}

          <Typography sx={{ fontSize: "30px", textAlign: "center" }}>
            Your balance is:
          </Typography>

          {!!user && (
            <Typography sx={{ fontSize: "70px", textAlign: "center" }}>
              $ {user.balance}
            </Typography>
          )}

          <Box
            sx={{
              width: "220px",
              margin: "auto",
              padding: "20px",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClickOpenWithdraw}
              disabled={user && user.balance === 0}
            >
              Withdraw
            </Button>

            <Dialog
              open={withdrawOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Withdraw"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  How much would you like to withdraw?
                </DialogContentText>
                <input
                  label="Withdraw"
                  sx={{ margin: 1 }}
                  type="text"
                  value={withdraw}
                  onChange={handleWithdrawInputChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleWithdraw}>Withdraw</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="outlined"
              sx={{ margin: "5px" }}
              onClick={handleClickOpenDeposit}
            >
              Deposit
            </Button>
            <Dialog
              open={depositOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Deposit"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  How much would you like to deposit?
                </DialogContentText>
                <input
                  label="Deposit"
                  sx={{ margin: 1 }}
                  type="text"
                  value={deposit}
                  onChange={handleDepositInputChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeposit}>Deposit</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Card>
      )}
    </>
  );
}
