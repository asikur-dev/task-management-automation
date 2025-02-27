// src/hooks/useRoleAccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const useRoleAccess = (allowedRoles) => {
  const navigate = useNavigate();
  const { user } = useUser(); // Assuming `useUser` provides the current user's details

  useEffect(() => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/");
    } else if (!allowedRoles.includes(user.role)) {
      // If the user's role is not in the allowed roles, redirect to a "Not Found" or "Access Denied" page
      navigate(`/${user.role}/dashboard`); // Replace with your "Not Found" or "Access Denied" page
    }
  }, [user, navigate, allowedRoles]);
};
