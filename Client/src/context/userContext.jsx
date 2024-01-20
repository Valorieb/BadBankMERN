import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const updateBalance = (newBalance) => {
    setUser((prevUser) => ({ ...prevUser, balance: newBalance }));
  };

  const updateName = (newName) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }));
  };

  const updateEmail = (newEmail) => {
    setUser((prevUser) => ({ ...prevUser, email: newEmail }));
  };

  const fetchBalance = () => {
    axios
      .get("/api/profile")
      .then((response) => {
        const newBalance = response.data.balance;
        updateBalance(newBalance);
        console.log("User updated with new balance:", newBalance);
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
  };

  const fetchName = () => {
    axios
      .get("/api/profile")
      .then((response) => {
        const newName = response.data.name;
        updateName(newName);
        console.log("User updated with new balance:", newName);
      })
      .catch((error) => {
        console.error("Error fetching name:", error);
      });
  };

  const fetchEmail = () => {
    axios
      .get("/api/profile")
      .then((response) => {
        const newEmail = response.data.email;
        updateEmail(newEmail);
        console.log("User updated with new email:", newEmail);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  };

  useEffect(() => {
    if (!user) {
      axios.get("/api/profile").then(({ data }) => {
        setUser((prevUser) => ({ ...prevUser, ...data }));

        console.log("user data: ", data);
      });
    } else {
      fetchBalance();
    }
  }, []);

  const contextValue = {
    user,
    setUser,
    updateBalance,
    fetchBalance,
    updateName,
    fetchName,
    updateEmail,
    fetchEmail,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
