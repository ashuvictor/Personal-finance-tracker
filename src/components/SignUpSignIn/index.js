import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase"; // Import Firebase services
import Input from "../Input"; // Custom Input component
import "./styles.css";
import Button from "../Button"; // Custom Button component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Full name is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const signUpWithEmail = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!validateForm()) return;

    setLoading(true); // Start loading
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success(`Welcome, ${name}! Your account has been created.`);
      console.log("User signed up:", user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName}! You've signed in with Google.`);
      console.log("Google Sign-In User:", user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      {/* Toast Container for notifications */}
      <ToastContainer />
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely</span>
      </h2>
      <form>
        <Input
          label="Full Name"
          state={name}
          setState={setName}
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          state={email}
          setState={setEmail}
          placeholder="john@gmail.com"
        />
        <Input
          type="password"
          label="Password"
          state={password}
          setState={setPassword}
          placeholder="At least 6 characters"
        />
        <Input
          type="password"
          label="Confirm Password"
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder="Re-enter your password"
        />
        <Button
          text={loading ? "Signing Up..." : "Sign Up with Email"}
          onClick={signUpWithEmail}
          disabled={loading}
        />
        <p style={{ textAlign: "center" }}>Or</p>
        <Button
          text={loading ? "Please wait..." : "Sign Up with Google"}
          blue
          onClick={signInWithGoogle}
          disabled={loading}
        />
      </form>
    </div>
  );
}

export default SignupSigninComponent;
