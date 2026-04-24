import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Product from "./components/Product";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import UpdateProduct from "./components/UpdateProduct";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSellers from "./pages/AdminSellers";
import Unauthorized from "./pages/Unauthorized";
import SellerProducts from "./pages/SellerProducts";
import SellerEarnings from "./pages/SellerEarnings";
import AdminHomepage from "./pages/AdminHomepage";

function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid bg-light text-dark min-vh-100 p-0">
        <Navbar />

        <main className="container pt-5 mt-4">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password/:id" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* CUSTOMER */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            {/* SELLER */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add_product"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/update/:id"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <UpdateProduct />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/earnings"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerEarnings />
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/sellers"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminSellers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/homepage"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminHomepage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;