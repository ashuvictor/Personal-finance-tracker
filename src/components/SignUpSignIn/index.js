import React, { useState } from "react";
import Input from "../Input";
import "./styles.css";
import Button from "../Button";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function signUpwithEmail () {
    console.log("Check")
  }

  return (
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on
        <span style={{ color: "var(--theme)" }}> Financely </span>
      </h2>
      <form>
        <Input
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"John Doe"}
        />
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"john@gmail.com"}
        />{" "}
        <Input
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example :123456"}
        />{" "}
        <Input
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Example:123456"}
        />
        <Button text ={"Sign up using email and password"} onClick={signUpwithEmail}/>
        <p style={{textAlign:"center"}}>Or</p>
        <Button text ={"Sign up using google"} blue/>
      </form>
    </div>
  );
}

export default SignupSigninComponent;
