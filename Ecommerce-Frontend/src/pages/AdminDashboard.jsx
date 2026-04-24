import { Link } from "react-router-dom";

const AdminDashboard = () => (
  <div className="admin-page min-vh-100 py-5">
    <div className="container text-center">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Manage Sellers</h5>

              <Link to="/admin/sellers" className="btn btn-primary w-100">
                Go to Sellers
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Homepage Editor</h5>

              <Link to="/admin/homepage" className="btn btn-success w-100">
                Edit Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;