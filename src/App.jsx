import { Routes, Route } from "react-router-dom";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomeBanner from "./pages/admin/HomeBanner";
import Home from "./pages/customer/Home";
import Cakes from "./pages/customer/Cakes";
import CakeDetails from "./pages/customer/CakeDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Login from "./pages/customer/Login";
import Register from "./pages/customer/Register";
import MyOrders from "./pages/customer/MyOrders";
import OrderDetails from "./pages/customer/OrderDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import CakesAdmin from "./pages/admin/CakesAdmin";
import Sizes from "./pages/admin/Sizes";
import Colors from "./pages/admin/Colors";
import Fillings from "./pages/admin/Fillings";
import Flavours from "./pages/admin/Flavours";
import Customers from "./pages/admin/Customers";
import PaymentSettings from "./pages/admin/PaymentSettings";
import SocialMedia from "./pages/admin/SocialMedia";
import CheckoutSettings from "./pages/admin/CheckoutSettings";

function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cakes" element={<Cakes />} />
        <Route path="/cake/:id" element={<CakeDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-orders/:id" element={<OrderDetails />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home-banner" element={<HomeBanner />} />
        <Route path="social-media" element={<SocialMedia />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cakes" element={<CakesAdmin />} />
        <Route path="categories" element={<Categories />} />
        <Route path="sizes" element={<Sizes />} />
        <Route path="colors" element={<Colors />} />
        <Route path="fillings" element={<Fillings />} />
        <Route path="flavours" element={<Flavours />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payment-settings" element={<PaymentSettings />} />
        <Route path="checkout-settings" element={<CheckoutSettings />} />
      </Route>
    </Routes>
  );
}
export default App;
