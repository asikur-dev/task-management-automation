import { useState } from "react";

// Custom hook for managing user data in localStorage
export function useUser() {
  // Get initial user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || null;

  // State to manage user info
  const [user, setUser] = useState(storedUser);

  // Function to save user info to localStorage and state
  const saveUserLocalstorage = (userInfo, token) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", token);

    setUser(userInfo);
  };

  // Function to clear user info from localStorage and state
  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, saveUserLocalstorage, clearUser };
}
