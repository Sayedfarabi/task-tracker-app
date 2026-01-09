import React, { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { useToast } from "../toast/toast";
import { login } from "../../store/authSlice";
import LoginForm from "./LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    if (!email.includes("@")) {
      showToast("Please enter a valid email", "error");
      return;
    }

    setLoading(true);

    try {
      const userId = `user-${Date.now()}`;
      const fakeToken = `fake-jwt-token-${userId}`;

      dispatch(
        login({
          email: email.toLowerCase(),
          userId: userId,
          token: fakeToken,
        })
      );

      showToast("Login successful!", "success");
    } catch (error) {
      showToast("Login failed. Please try again.", "error");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      loginHandler={handleLogin}
      setEmail={setEmail}
      email={email}
      loading={loading}
    />
  );
};

export default Login;
