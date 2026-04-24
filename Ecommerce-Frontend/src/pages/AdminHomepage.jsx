import { useEffect, useState } from "react";
import api from "../axios";

const AdminHomepage = () => {
  const [contents, setContents] = useState([]);

  const [form, setForm] = useState({
    type: "BANNER",
    title: "",
    subtitle: "",
    imageUrl: "",
    redirectUrl: "",
    productId: "",
    positionOrder: 1,
    active: true,
  });

  const [message, setMessage] = useState("");

  const loadContents = async () => {
    const response = await api.get("/admin/homepage");
    setContents(response.data);
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addContent = async (e) => {
    e.preventDefault();

    await api.post("/admin/homepage", {
      ...form,
      productId: form.productId || null,
    });

    setMessage("Homepage content added");
    loadContents();

    setForm({
      type: "BANNER",
      title: "",
      subtitle: "",
      imageUrl: "",
      redirectUrl: "",
      productId: "",
      positionOrder: 1,
      active: true,
    });
  };

  const activate = async (id) => {
    await api.put(`/admin/homepage/${id}/activate`);
    loadContents();
  };

  const deactivate = async (id) => {
    await api.put(`/admin/homepage/${id}/deactivate`);
    loadContents();
  };

  const deleteContent = async (id) => {
    await api.delete(`/admin/homepage/${id}`);
    loadContents();
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">

        <h2 className="fw-bold mb-4">Admin Homepage Editor</h2>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <form onSubmit={addContent} className="card border-0 shadow rounded-4 mb-4">
          <div className="card-body">
            <div className="row g-3">

              <div className="col-md-6">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="BANNER">Banner</option>
                  <option value="OFFER">Offer</option>
                  <option value="FEATURED">Featured</option>
                  <option value="DEAL">Deal</option>
                </select>
              </div>

              <div className="col-md-6">
                <input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <input
                  name="subtitle"
                  placeholder="Subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="imageUrl"
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="redirectUrl"
                  placeholder="Redirect URL"
                  value={form.redirectUrl}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="productId"
                  type="number"
                  placeholder="Product ID"
                  value={form.productId}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <input
                  name="positionOrder"
                  type="number"
                  placeholder="Position Order"
                  value={form.positionOrder}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="form-check-input"
                    id="active"
                  />
                  <label className="form-check-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button className="btn btn-primary w-100 fw-semibold">
                  Add Content
                </button>
              </div>

            </div>
          </div>
        </form>

        <div className="card border-0 shadow rounded-4">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {contents.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.title}</td>
                      <td>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="rounded"
                            style={{
                              width: "80px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </td>
                      <td>{item.positionOrder}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.active ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {item.active ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {item.active ? (
                            <button
                              onClick={() => deactivate(item.id)}
                              className="btn btn-warning btn-sm"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => activate(item.id)}
                              className="btn btn-success btn-sm"
                            >
                              Activate
                            </button>
                          )}

                          <button
                            onClick={() => deleteContent(item.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {contents.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No homepage content found
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

export default AdminHomepage;