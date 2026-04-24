import { useEffect, useState } from "react";
import api from "../axios";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState("");

  const loadSellers = async () => {
    const response = await api.get("/admin/sellers");
    setSellers(response.data);
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const approveSeller = async (sellerId) => {
    await api.put(`/admin/sellers/${sellerId}/approve`);
    setMessage("Seller approved successfully");
    loadSellers();
  };

  const rejectSeller = async (sellerId) => {
    const reason = prompt("Enter rejection reason:");
    await api.put(`/admin/sellers/${sellerId}/reject?reason=${reason || ""}`);
    setMessage("Seller rejected successfully");
    loadSellers();
  };

  const suspendSeller = async (sellerId) => {
    await api.put(`/admin/sellers/${sellerId}/suspend`);
    setMessage("Seller suspended successfully");
    loadSellers();
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">

        <h2 className="fw-bold mb-4">Seller Verification</h2>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        <div className="card border-0 shadow rounded-4">
          <div className="card-body">

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Shop Name</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {sellers.map((seller) => (
                    <tr key={seller.id}>
                      <td>{seller.id}</td>
                      <td>{seller.shopName}</td>
                      <td>{seller.user?.name}</td>
                      <td>{seller.user?.email}</td>
                      <td>{seller.phone}</td>

                      <td>
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
                      </td>

                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            onClick={() => approveSeller(seller.id)}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => rejectSeller(seller.id)}
                            className="btn btn-warning btn-sm"
                          >
                            Reject
                          </button>

                          <button
                            onClick={() => suspendSeller(seller.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {sellers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No sellers found
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

export default AdminSellers;