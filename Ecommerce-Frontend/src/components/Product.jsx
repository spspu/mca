import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/Context";
import api from "../axios";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(response.data);

        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await api.delete(`/seller/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <h2 className="fw-bold text-secondary">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="card border-0 shadow rounded-4">
          <div className="card-body p-4">
            <div className="row g-4 align-items-start">

              <div className="col-md-6">
                <img
                  src={imageUrl}
                  alt={product.imageName}
                  className="img-fluid rounded-4 w-100"
                  style={{ height: "420px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-6">
                <div className="border-bottom pb-4">

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary text-uppercase">
                      {product.category}
                    </span>

                    <small className="text-muted">
                      Listed:{" "}
                      <i>
                        {new Date(product.releaseDate).toLocaleDateString()}
                      </i>
                    </small>
                  </div>

                  <h1 className="fw-bold text-capitalize mb-2">
                    {product.name}
                  </h1>

                  <p className="text-muted fst-italic mb-4">
                    {product.brand}
                  </p>

                  <p className="fw-bold mb-2">PRODUCT DESCRIPTION:</p>

                  <p className="text-muted lh-lg">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4">
                  <h2 className="fw-bold">₹{product.price}</h2>

                  <h6 className="text-secondary mt-3">
                    Stock Available:{" "}
                    <span className="fw-bold text-success">
                      {product.stockQuantity}
                    </span>
                  </h6>
                </div>

                <div className="mt-4">
                  {role === "CUSTOMER" && (
                    <button
                      className={`btn px-4 py-2 fw-semibold ${
                        product.productAvailable
                          ? "btn-primary"
                          : "btn-secondary"
                      }`}
                      onClick={handleAddToCart}
                      disabled={!product.productAvailable}
                    >
                      {product.productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  )}

                  {role === "SELLER" && (
                    <div className="d-flex flex-wrap gap-3">
                      <button
                        className="btn btn-primary px-4 py-2 fw-semibold"
                        type="button"
                        onClick={handleEditClick}
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-danger px-4 py-2 fw-semibold"
                        type="button"
                        onClick={deleteProduct}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {!role && (
                    <div className="alert alert-warning mt-3">
                      Please login as CUSTOMER to add product into cart.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;