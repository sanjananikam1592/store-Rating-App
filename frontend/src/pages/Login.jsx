import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {

      const response = await API.post("/auth/login", {
        email: email,
        password: password
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      const role = response.data.user.role;

      if (role === "ADMIN") {
        window.location.href = "/admin";
      }

      if (role === "USER") {
        window.location.href = "/stores";
      }

      if (role === "OWNER") {
        window.location.href = "/owner";
      }

    } catch (err) {
      alert("Invalid Email or Password");
    }
  }

  return (
    <div className="auth-box">
      <h2>Store Rating Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={function(e) {
            setEmail(e.target.value);
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={function(e) {
            setPassword(e.target.value);
          }}
        />

        <button type="submit">
          Login
        </button>

      </form>

      <p>
        New User ? <Link to="/signup">Create Account</Link>
      </p>

    </div>
  );
}

export default Login;