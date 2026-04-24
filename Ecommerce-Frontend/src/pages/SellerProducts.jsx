import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const loadMyProducts = async () => {
    try {
      const response = await api.get("/seller/products");
      setProducts(response.data);
    } catch (err) {
      setMessage("Unable to load seller products");
    }
  };

  useEffect(() => {
    loadMyProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/seller/product/${id}`);
      setMessage("Product deleted successfully");
      loadMyProducts();
    } catch (err) {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container-fluid px-4">

        <h2 className="fw-bold mb-4">My Products</h2>

        {message && (
          <div className="alert alert-info">
            {message}
          </div>
        )}

        <Link to="/add_product" className="btn btn-primary mb-4 fw-semibold">
          Add Product
        </Link>

        <div className="card shadow border-0 rounded-4">
          <div className="card-body">
            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Available</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>

                      <td>
                        <img
                          src={`http://localhost:8080/api/product/${product.id}/image`}
                          alt={product.name}
                          className="rounded"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                          }}
                        />
                      </td>

                      <td className="fw-semibold">{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>

                      <td className="fw-semibold text-success">
                        ₹{product.price}
                      </td>

                      <td>{product.stockQuantity}</td>

                      <td>
                        <span
                          className={`badge ${
                            product.productAvailable
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {product.productAvailable ? "Yes" : "No"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/product/update/${product.id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-4">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerProducts;