const Unauthorized = () => {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow border-0 rounded-4 text-center p-4" style={{ maxWidth: "400px", width: "100%" }}>
        
        <h1 className="display-4 text-danger fw-bold mb-3">
          403
        </h1>

        <h4 className="fw-semibold mb-2">
          Unauthorized Access
        </h4>

        <p className="text-muted mb-0">
          You do not have permission to access this page.
        </p>

      </div>
    </div>
  );
};

export default Unauthorized;