import React, { useState } from "react";
import api from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    api
      .post("/seller/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Product added successfully");
      })
      .catch(() => {
        alert("Error adding product");
      });
  };

  return (
    <div className="bg-light min-vh-100 pt-5 px-3">
      <div className="container">
        <div className="card shadow border-0 rounded-4 mx-auto" style={{ maxWidth: "900px" }}>
          <div className="card-body p-4">
            <h2 className="fw-bold mb-4 text-dark">Add Product</h2>

            <form onSubmit={submitHandler}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    placeholder="Brand"
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    placeholder="Product Description"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    placeholder="₹1000"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Toys">Toys</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Stock</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="Stock Quantity"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={product.releaseDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Image</label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      checked={product.productAvailable}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          productAvailable: e.target.checked,
                        })
                      }
                      className="form-check-input"
                      id="productAvailable"
                    />
                    <label className="form-check-label" htmlFor="productAvailable">
                      Product Available
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100 fw-semibold">
                    Submit
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;