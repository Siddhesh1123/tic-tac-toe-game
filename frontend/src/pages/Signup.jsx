import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Lottie from "react-lottie";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }
    if (formData.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        formData
      );

      toast.success(response.data.message || "Signup successful");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      if (errorMessage.includes("already registered")) {
        toast.error("User already registered. Redirecting to login...");
        navigate("/");
      } else {
        toast.error(errorMessage);
      }
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
      <div className="hero-content flex-col lg:flex-row bg-blue-200 rounded-lg">
        {/* Signup Form */}
        <div className="card w-auto shadow-2xl bg-slate-100 lg:w-1/2 rounded-lg">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center text-blue-700">
              Signup
            </h1>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-blue-600">Username</span>
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
                <span className="label-text text-blue-600">Password</span>
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
                className={`btn bg-blue-600 text-white text-xl border-0 ${
                  loading ? "loading" : ""
                }`}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </div>
          </form>
          <p className="text-center mt-4 mb-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>

        {/* Lottie Animation for Desktop */}
        <div className="hidden lg:block w-1/2">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
