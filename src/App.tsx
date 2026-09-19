import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { StoreProvider } from "./context/Store";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";
import { RepairPage } from "./pages/Repair";
import { SearchPage } from "./pages/Explore";
import { SellPage } from "./pages/Sell";
import { ThriftPage } from "./pages/Thrift";
import { ThriftItemPage } from "./pages/ThriftItem";
import { HelpPage, AboutPage, PrivacyPage, TermsPage } from "./pages/Help";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { MorePage } from "./pages/More";
import { NotificationsPage } from "./pages/Notifications";
import { OrderDetailPage } from "./pages/OrderDetail";
import { OrderSuccessPage } from "./pages/OrderSuccess";
import { OrdersPage } from "./pages/Orders";
import { ProductPage } from "./pages/Product";
import { SplashPage } from "./pages/Splash";
import { WishlistPage } from "./pages/Wishlist";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<SplashPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/haat" element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/thrift/:id" element={<ThriftItemPage />} />
            <Route path="/thrift" element={<ThriftPage />} />
            <Route path="/repair" element={<RepairPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route path="/profile" element={<Navigate to="/more" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </StoreProvider>
  );
}
