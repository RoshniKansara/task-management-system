import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link } from "react-router-dom";
import "../Login.css";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);

      console.log("LOGIN RESPONSE =", JSON.stringify(data));
      console.log("ROLE =", data.role);
      console.log("TOKEN =", data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Login successful!");

      if(data.role === "ADMIN"){
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Invalid email or password");
      console.error(error);
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
       <h1 className="app-title">
          TaskFlow
        </h1>

        <p className="app-subtitle">
          Smart Task Management System
        </p>
      <h2>Welcome Back 👋</h2>
    <div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-container">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </span>

      </div>

      <button onClick={handleLogin}>
        Login
      </button>
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>

    </div>
  </div>
  );
}

export default Login;