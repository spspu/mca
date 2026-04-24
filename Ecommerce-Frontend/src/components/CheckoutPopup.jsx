import React from "react";

const CheckoutPopup = ({
  show,
  handleClose,
  cartItems,
  totalPrice,
  handleCheckout,
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Checkout</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
              
              {cartItems.map((item) => (
                <div key={item.id} className="card mb-3 border-0 shadow-sm">
                  <div className="row g-0 align-items-center">

                    <div className="col-md-3 text-center p-2">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ height: "100px", objectFit: "cover" }}
                      />
                    </div>

                    <div className="col-md-9">
                      <div className="card-body py-2">
                        <h6 className="fw-semibold mb-1">{item.name}</h6>
                        <p className="mb-1 text-muted">
                          Quantity: {item.quantity}
                        </p>
                        <p className="mb-0 text-muted">
                          Price: ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="text-center mt-3">
                <h5 className="fw-bold">Total: ₹{totalPrice}</h5>
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>

              <button
                className="btn btn-primary"
                onClick={handleCheckout}
              >
                Confirm Purchase
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPopup;