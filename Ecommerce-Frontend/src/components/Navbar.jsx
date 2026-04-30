import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppContext from "../context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const { cart } = useContext(AppContext);

  const navigate = useNavigate();

  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark-theme" || storedTheme === "light-theme"
      ? storedTheme
      : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme", "light_theme");
    document.documentElement.classList.remove("light-theme", "dark-theme");

    document.body.classList.add(theme);
    document.documentElement.classList.add(theme);

    document.documentElement.setAttribute(
      "data-bs-theme",
      theme === "dark-theme" ? "dark" : "light"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "dark-theme" ? "light-theme" : "dark-theme"
    );
  };

  const handleCategorySelect = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const handleChange = async (value) => {
    setInput(value);

    if (value.length >= 1) {
      setShowSearchResults(true);

      try {
        const response = await axios.get(
          `http://52.55.8.58:8080/api/products/search?keyword=${value}`
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
    <nav
      className={`navbar navbar-expand-lg shadow fixed-top theme-navbar ${
        theme === "dark-theme" ? "navbar-dark" : "navbar-light"
      }`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          HiTeckKart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
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

          <div className="d-flex align-items-center gap-3 position-relative">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px" }}
              type="button"
            >
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <div className="position-relative">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />

              {showSearchResults && (
                <ul className="list-group position-absolute w-100 mt-1 shadow">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <li key={result.id} className="list-group-item">
                        <Link
                          to={`/product/${result.id}`}
                          className="search-result-link"
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

            {isAuthenticated && role === "CUSTOMER" && (
              <Link
                to="/cart"
                className="cart-link position-relative fs-4 d-flex align-items-center text-decoration-none"
              >
                <i className="bi bi-cart"></i>

                {cartCount > 0 && (
                  <span
                    className="position-absolute badge rounded-pill bg-danger"
                    style={{
                      top: "-10px",
                      right: "-12px",
                      fontSize: "10px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && (
              <>
                <span className="fw-semibold">Hi, {user?.name}</span>

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