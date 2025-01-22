import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Lottie from "react-lottie";
import { useAuth } from "../api/authentication";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.trim() === "") {
      toast.error("Username is required");
      return;
    }
    if (formData.password.trim() === "") {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      login();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const defaultOptions = {
    loop: true,
    autoplay: true,
    path: "/loginanim.json", // Reference to the public folder
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

return (
  <div className="hero bg-gray-100 min-h-screen">
    <Toaster />
    <div className="hero-content flex-col lg:flex-row bg-red-200 rounded-lg">
      {/* Lottie Animation for Desktop */}
      <div className="hidden lg:block w-1/2">
        <Lottie options={defaultOptions} height={400} width={400} />
      </div>

      {/* Login Form */}
      <div className="card w-auto shadow-2xl bg-slate-100 lg:w-1/2 rounded-lg">
        <form className="card-body" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold text-center text-pink-700">
            Login
          </h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-pink-600">Username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered bg-slate-200"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-pink-600">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered bg-slate-200"
              required
            />
          </div>
          <div className="form-control mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`btn bg-pink-600 text-white text-xl border-0 ${loading ? "loading" : ""}` }
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 mb-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-pink-700 font-semibold hover:underline"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  </div>
);
};

export default Login;
