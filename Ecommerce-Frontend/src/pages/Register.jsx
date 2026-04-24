import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    shopName: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow border-0 rounded-4" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="card-body p-4">

          <h3 className="fw-bold text-center mb-4">Register</h3>

          {error && (
            <div className="alert alert-danger text-center py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <select
                name="role"
                onChange={handleChange}
                className="form-select"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>

            {form.role === "SELLER" && (
              <>
                <div className="mb-3">
                  <input
                    name="shopName"
                    placeholder="Shop Name"
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-success w-100 fw-semibold"
            >
              Register
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;