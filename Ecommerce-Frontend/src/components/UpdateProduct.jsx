import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState();

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );

        setProduct(response.data);

        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );

        const imageFile = new File(
          [responseImage.data],
          response.data.imageName,
          { type: responseImage.data.type }
        );

        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageFile", image);

    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], {
        type: "application/json",
      })
    );

    try {
      await api.put(`/seller/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="card shadow border-0 rounded-4 mx-auto" style={{ maxWidth: "900px" }}>
          <div className="card-body p-4">

            <h2 className="fw-bold mb-4">Update Product</h2>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    value={updateProduct.name}
                    onChange={handleChange}
                    placeholder={product.name}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    name="brand"
                    value={updateProduct.brand}
                    onChange={handleChange}
                    placeholder={product.brand}
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <input
                    type="text"
                    name="description"
                    value={updateProduct.description}
                    onChange={handleChange}
                    placeholder={product.description}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    name="price"
                    value={updateProduct.price}
                    onChange={handleChange}
                    placeholder={product.price}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <select
                    name="category"
                    value={updateProduct.category}
                    onChange={handleChange}
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
                  <input
                    type="number"
                    name="stockQuantity"
                    value={updateProduct.stockQuantity}
                    onChange={handleChange}
                    placeholder={product.stockQuantity}
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="img-fluid rounded mb-3"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

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
                      checked={updateProduct.productAvailable}
                      onChange={(e) =>
                        setUpdateProduct({
                          ...updateProduct,
                          productAvailable: e.target.checked,
                        })
                      }
                      className="form-check-input"
                      id="available"
                    />
                    <label className="form-check-label" htmlFor="available">
                      Product Available
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold"
                  >
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

export default UpdateProduct;