import React, { useEffect } from "react";
import "./styles.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut function
import { useNavigate } from "react-router-dom";

function Header() {
  const [user, loading] = useAuthState(auth); // Hook to track the logged-in user
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  const logoutFunction = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/");
      alert("You have been logged out.");
    } catch (error) {
      alert(`Error logging out: ${error.message}`);
    }
  };

  return (
    <div className="navbar">
      <p className="logo">Financely</p>
      {user ? (
        <p className="logo link" onClick={logoutFunction}>
          Logout
        </p>
      ) : (
        <p className="logo link">Welcome, Guest</p>
      )}
    </div>
  );
}

export default Header;
