import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import AppContext from "../context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [homepageContent, setHomepageContent] = useState([]);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const loadHomepageContent = async () => {
    try {
      const response = await api.get("/homepage");
      setHomepageContent(response.data);
    } catch (error) {
      console.log("Homepage content not loaded");
    }
  };

  const addImagesToProducts = async (productList) => {
    return await Promise.all(
      productList.map(async (product) => {
        try {
          const response = await api.get(`/product/${product.id}/image`, {
            responseType: "blob",
          });

          const imageUrl = URL.createObjectURL(response.data);
          return { ...product, imageUrl };
        } catch (error) {
          return { ...product, imageUrl: "" };
        }
      })
    );
  };

  useEffect(() => {
    loadHomepageContent();
  }, []);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const loadProductsWithImages = async () => {
        const updatedProducts = await addImagesToProducts(data);
        setProducts(updatedProducts);
      };

      loadProductsWithImages();
    }
  }, [data]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const applyFilters = async () => {
    try {
      const response = await api.get("/products/filter", {
        params: {
          keyword: filters.keyword || null,
          category: filters.category || null,
          brand: filters.brand || null,
          minPrice: filters.minPrice || null,
          maxPrice: filters.maxPrice || null,
          inStock: filters.inStock || null,
        },
      });

      const filteredProductsWithImages = await addImagesToProducts(response.data);
      setProducts(filteredProductsWithImages);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="home-page min-vh-100 d-flex align-items-center justify-content-center">
        <img src={unplugged} alt="Error" style={{ width: "96px", height: "96px" }} />
      </div>
    );
  }

  return (
    <div className="home-page min-vh-100 py-5">
      <div className="container-fluid px-4">

        <div className="mb-4">
          {homepageContent
            .filter((item) => item.type === "BANNER")
            .map((item) => (
              <div key={item.id} className="theme-card card border-0 shadow mb-4 rounded-4">
                <div className="card-body text-center p-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="img-fluid rounded-4 mb-3 w-100"
                      style={{ height: "280px", objectFit: "cover" }}
                    />
                  )}

                  <h2 className="fw-bold">{item.title}</h2>
                  <p className="theme-muted mb-0">{item.subtitle}</p>
                </div>
              </div>
            ))}

          <div className="row g-4">
            {homepageContent
              .filter((item) => item.type !== "BANNER")
              .map((item) => (
                <div key={item.id} className="col-md-4">
                  <div className="theme-card card h-100 border-0 shadow rounded-4">
                    <div className="card-body">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="img-fluid rounded-3 mb-3 w-100"
                          style={{ height: "160px", objectFit: "cover" }}
                        />
                      )}

                      <h5 className="fw-semibold">{item.title}</h5>
                      <p className="theme-muted mb-0">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="theme-card card border-0 shadow mb-4 rounded-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">

              <div className="col-md-6 col-lg">
                <input className="form-control" name="keyword" placeholder="Search" value={filters.keyword} onChange={handleFilterChange} />
              </div>

              <div className="col-md-6 col-lg">
                <input className="form-control" name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange} />
              </div>

              <div className="col-md-6 col-lg">
                <input className="form-control" name="brand" placeholder="Brand" value={filters.brand} onChange={handleFilterChange} />
              </div>

              <div className="col-md-6 col-lg">
                <input className="form-control" name="minPrice" type="number" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} />
              </div>

              <div className="col-md-6 col-lg">
                <input className="form-control" name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>

              <div className="col-md-6 col-lg">
                <div className="theme-check form-check border rounded px-5 py-2">
                  <input className="form-check-input" type="checkbox" name="inStock" checked={filters.inStock} onChange={handleFilterChange} id="inStock" />
                  <label className="form-check-label" htmlFor="inStock">
                    Stock
                  </label>
                </div>
              </div>

              <div className="col-md-6 col-lg">
                <button className="btn btn-primary w-100 fw-semibold" onClick={applyFilters}>
                  Filter
                </button>
              </div>

            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "300px" }}>
            <h2 className="fw-bold theme-muted">No Products Available</h2>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageUrl } = product;

              return (
                <div key={id} className="col-sm-6 col-md-4 col-lg-3">
                  <div
                    className={`product-theme-card card h-100 border-0 shadow rounded-4 ${
                      !productAvailable ? "product-disabled" : ""
                    }`}
                  >
                    <Link to={`/product/${id}`} className="text-decoration-none product-link">
                      <div className="product-img-box">
                        <img
                          src={imageUrl}
                          alt={name}
                          className="card-img-top p-2"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column">
                        <h5 className="fw-bold text-uppercase">{name}</h5>
                        <p className="theme-muted fst-italic">~ {brand}</p>

                        <hr />

                        <h5 className="fw-bold">₹{price}</h5>

                        <button
                          className={`btn w-100 mt-auto fw-semibold rounded-pill ${
                            productAvailable ? "btn-primary" : "btn-secondary"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={!productAvailable}
                        >
                          {productAvailable ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;