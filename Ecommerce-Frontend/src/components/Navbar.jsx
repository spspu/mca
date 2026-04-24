import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onSelectCategory }) => {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
  };

  const handleChange = async (value) => {
    setInput(value);

    if (value.length >= 1) {
      setShowSearchResults(true);

      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow fixed-top">
      <div className="container-fluid">

        <Link className="navbar-brand fw-bold text-primary" to="/">
          HiTeckKart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* LEFT MENU */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {isAuthenticated && role === "CUSTOMER" && (
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>
            )}

            {isAuthenticated && role === "SELLER" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/seller/dashboard">
                    Seller Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add_product">
                    Add Product
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">
                    Admin Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/sellers">
                    Manage Sellers
                  </Link>
                </li>
              </>
            )}

            {/* CATEGORY DROPDOWN */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                data-bs-toggle="dropdown"
              >
                Categories
              </button>

              <ul className="dropdown-menu">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex align-items-center gap-3 position-relative">

            {/* SEARCH */}
            <div className="position-relative">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />

              {showSearchResults && (
                <ul className="list-group position-absolute w-100 mt-1 shadow" style={{ zIndex: 1000 }}>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li key={result.id} className="list-group-item">
                        <Link
                          to={`/product/${result.id}`}
                          className="text-decoration-none text-dark"
                        >
                          {result.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    noResults && (
                      <li className="list-group-item text-danger">
                        No Product Found
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* USER */}
            {isAuthenticated && (
              <>
                <span className="fw-semibold text-dark">
                  Hi, {user?.name}
                </span>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;