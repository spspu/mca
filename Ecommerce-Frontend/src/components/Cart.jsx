import React, { useContext, useState, useEffect } from "react";
import AppContext from "../context/Context";
import api from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((p) => p.id);

        const updatedCartItems = cart.filter((item) =>
          backendProductIds.includes(item.id)
        );

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const res = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );

              const imageUrl = URL.createObjectURL(res.data);
              return { ...item, imageUrl };
            } catch (error) {
              return { ...item, imageUrl: "" };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error(error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const updated = cartItems.map((item) =>
      item.id === itemId && item.quantity < item.stockQuantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updated);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updated = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updated);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      const checkoutRequest = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post(
        "/customer/orders/checkout",
        checkoutRequest
      );

      alert("Order placed successfully. Order ID: " + response.data.id);

      clearCart();
      setCartItems([]);
    } catch (error) {
      alert(error.response?.data || "Checkout failed");
    }
  };

  return (
    <div className="cart-page min-vh-100 py-5">
      <div className="container-fluid px-4">
        <div className="cart-theme-card card shadow border-0 rounded-4">
          <div className="card-body p-4">
            <h2 className="fw-bold mb-4 border-bottom pb-3">
              Shopping Bag
            </h2>

            {cartItems.length === 0 ? (
              <div className="alert alert-secondary text-center">
                Your cart is empty
              </div>
            ) : (
              <>
                <ul className="list-group list-group-flush cart-list">
                  {cartItems.map((item) => (
                    <li key={item.id} className="list-group-item py-3">
                      <div className="row align-items-center">
                        <div className="col-md-4 d-flex align-items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              backgroundColor: "#fff",
                            }}
                          />

                          <div>
                            <small className="theme-muted">{item.brand}</small>
                            <h6 className="mb-0 fw-semibold">{item.name}</h6>
                          </div>
                        </div>

                        <div className="col-md-3 text-center">
                          <div className="btn-group">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleDecreaseQuantity(item.id)}
                            >
                              -
                            </button>

                            <input
                              value={item.quantity}
                              readOnly
                              className="form-control text-center"
                              style={{ width: "60px" }}
                            />

                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleIncreaseQuantity(item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-md-2 text-center fw-bold">
                          ₹{item.price * item.quantity}
                        </div>

                        <div className="col-md-3 text-end">
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="d-flex flex-column align-items-end mt-4 border-top pt-3">
                  <h4 className="fw-bold">Total: ₹{totalPrice}</h4>

                  <button
                    onClick={handleCheckout}
                    className="btn btn-success px-4 mt-2"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;