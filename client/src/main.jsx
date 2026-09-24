import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { CustomerLayout } from './components/layout/CustomerLayout.jsx';
import { AdminLayout } from './components/layout/AdminLayout.jsx';

// Public Pages
import { Home } from './pages/public/Home.jsx';
import { About } from './pages/public/About.jsx';
import { Products } from './pages/public/Products.jsx';
import { ProductDetail } from './pages/public/ProductDetail.jsx';
import { UseCases } from './pages/public/UseCases.jsx';
import { DSCFinder } from './pages/public/DSCFinder.jsx';
import { HowItWorks } from './pages/public/HowItWorks.jsx';
import { Pricing } from './pages/public/Pricing.jsx';
import { FAQ } from './pages/public/FAQ.jsx';
import { Contact } from './pages/public/Contact.jsx';
import { Login } from './pages/public/Login.jsx';
import { Register } from './pages/public/Register.jsx';
import { AdminLogin } from './pages/public/AdminLogin.jsx';
import { Checkout } from './pages/public/Checkout.jsx';
import { OrderSuccess } from './pages/public/OrderSuccess.jsx';
import { Privacy } from './pages/public/Privacy.jsx';
import { Refund } from './pages/public/Refund.jsx';
import { Terms } from './pages/public/Terms.jsx';
import { Resources } from './pages/public/Resources.jsx';
import { TrackOrder } from './pages/public/TrackOrder.jsx';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard.jsx';
import { MyOrders } from './pages/customer/MyOrders.jsx';
import { OrderDetails } from './pages/customer/OrderDetails.jsx';
import { BuyDSC } from './pages/customer/BuyDSC.jsx';
import { MyApplications } from './pages/customer/MyApplications.jsx';
import { DocumentsVault } from './pages/customer/DocumentsVault.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminProducts } from './pages/admin/AdminProducts.jsx';
import { AdminOrders } from './pages/admin/AdminOrders.jsx';
import { AdminUsers } from './pages/admin/AdminUsers.jsx';
import { AdminFAQs } from './pages/admin/AdminFAQs.jsx';
import { AdminContacts } from './pages/admin/AdminContacts.jsx';

const App = () => (
  <Routes>
    {/* Public Website Routes */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/use-cases" element={<UseCases />} />
      <Route path="/dsc-finder" element={<DSCFinder />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faqs" element={<FAQ />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/track" element={<TrackOrder />} />
    </Route>

    {/* Customer Portal Routes */}
    <Route path="/dashboard" element={<CustomerLayout />}>
      <Route index element={<CustomerDashboard />} />
      <Route path="buy" element={<BuyDSC />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="orders/:orderId" element={<OrderDetails />} />
      <Route path="applications" element={<MyApplications />} />
      <Route path="documents" element={<DocumentsVault />} />
    </Route>

    {/* Admin Portal Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="faqs" element={<AdminFAQs />} />
      <Route path="contacts" element={<AdminContacts />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
