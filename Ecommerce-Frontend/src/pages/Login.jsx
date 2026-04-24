import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form.email, form.password);

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.role === "SELLER") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow border-0 rounded-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body p-4">

          <h3 className="fw-bold text-center mb-4">Login</h3>

          {error && (
            <div className="alert alert-danger py-2 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
            >
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;