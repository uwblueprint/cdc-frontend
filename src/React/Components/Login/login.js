import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import validator from "validator";
import empty from "is-empty";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const allErrors = {};
    setErrors(allErrors);

    if (!validator.isEmail(email)) {
      allErrors.email = "Invalid email address";
    }

    if (email !== "example@gmail.com" || password !== "1234") {
      allErrors.password = "Provided email and password are incorrect";
    } 

    if (!empty(allErrors)) {
      setErrors(allErrors);
      setValidated(false);
    } else {
      setValidated(true);
      console.log("You're in :)");
    }

  }

  return (
    <div className="Login">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            isInvalid={errors.email}
            value={email}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            isInvalid={errors.password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}