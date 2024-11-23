import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider, db } from "../../firebase"; // Import Firebase services
import { doc, setDoc, getDoc } from "firebase/firestore";
import Input from "../Input";
import Button from "../Button";
import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Email is required.");
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
    if (!loginForm && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await createDoc(user, name, email);
      navigate("/dashboard");
      toast.success(`Account created successfully for ${name}!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/dashboard");
      toast.success(`Welcome back, ${user.displayName || "User"}!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createDoc(user, user.displayName, user.email); // Add user to Firestore if not exists
      navigate("/dashboard");
      toast.success(
        `Welcome, ${user.displayName}! You've signed in with Google.`
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDoc = async (user, name, email) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        // User document does not exist, create a new one
        await setDoc(userDocRef, {
          name: name || "Google User",
          email: email,
          uid: user.uid,
        });
        console.log("User document created in Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }
    } catch (error) {
      console.error("Error checking/creating user document:", error);
    }
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
      {loginForm ? (
        <>
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
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
            <Button
              text={loading ? "Logging in..." : "Login with Email"}
              onClick={handleLogin}
              disabled={loading}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Don't have an account? Sign up here
            </p>
            <Button
              text={loading ? "Please wait..." : "Login with Google"}
              blue
              onClick={handleGoogleSignIn}
              disabled={loading}
            />
          </form>
        </>
      ) : (
        <>
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
              text={loading ? "Signing up..." : "Sign Up with Email"}
              onClick={handleSignup}
              disabled={loading}
            />
            <p className="p-login">Or</p>
            <Button
              text={loading ? "Please wait..." : "Sign Up with Google"}
              blue
              onClick={handleGoogleSignIn}
              disabled={loading}
            />
            <p className="p-login" onClick={() => setLoginForm(!loginForm)}>
              Already have an account? Login here
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default SignupSigninComponent;
