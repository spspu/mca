import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";

const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSellerProfile = async () => {
      try {
        const response = await api.get("/seller/profile");
        setSeller(response.data);
      } catch (err) {
        setError("Unable to load seller profile");
      }
    };

    loadSellerProfile();
  }, []);

  if (error) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger text-center shadow">
          {error}
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <h4 className="fw-semibold text-secondary">
          Loading seller dashboard...
        </h4>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "700px" }}>

        <h2 className="fw-bold text-center mb-4">
          Seller Dashboard
        </h2>

        <div className="card shadow border-0 rounded-4">
          <div className="card-body p-4">

            <h5 className="fw-semibold mb-3">
              Shop Name:{" "}
              <span className="text-primary">{seller.shopName}</span>
            </h5>

            <p className="mb-2">
              Phone: <strong>{seller.phone}</strong>
            </p>

            <p className="mb-3">
              Address: <strong>{seller.address}</strong>
            </p>

            <h5 className="fw-semibold mb-3">
              Status:{" "}
              <span
                className={`badge ${
                  seller.status === "APPROVED"
                    ? "bg-success"
                    : seller.status === "PENDING"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {seller.status}
              </span>
            </h5>

            {/* STATUS ALERTS */}
            {seller.status === "PENDING" && (
              <div className="alert alert-warning">
                Your seller account is waiting for admin approval.
              </div>
            )}

            {seller.status === "REJECTED" && (
              <div className="alert alert-danger">
                Your seller account was rejected.
                {seller.rejectionReason && (
                  <p className="mt-2 mb-0">
                    <strong>Reason:</strong> {seller.rejectionReason}
                  </p>
                )}
              </div>
            )}

            {seller.status === "SUSPENDED" && (
              <div className="alert alert-danger">
                Your seller account is suspended. You cannot manage products.
              </div>
            )}

            {/* ACTION BUTTONS */}
            {seller.status === "APPROVED" && (
              <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">

                <Link
                  to="/add_product"
                  className="btn btn-primary"
                >
                  Add Product
                </Link>

                <Link
                  to="/seller/products"
                  className="btn btn-success"
                >
                  My Products
                </Link>

                <Link
                  to="/seller/earnings"
                  className="btn btn-info text-white"
                >
                  Earnings
                </Link>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;