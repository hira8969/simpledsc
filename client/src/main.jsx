import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { PublicLayout } from './components/layout/PublicLayout.jsx';
import { CustomerLayout } from './components/layout/CustomerLayout.jsx';
import { AdminLayout } from './components/layout/AdminLayout.jsx';
import { Home } from './pages/public/Home.jsx';
import { About } from './pages/public/About.jsx';
import { AdminLogin } from './pages/public/AdminLogin.jsx';
import { Contact } from './pages/public/Contact.jsx';
import { DSCFinder } from './pages/public/DSCFinder.jsx';
import { FAQ } from './pages/public/FAQ.jsx';
import { HowItWorks } from './pages/public/HowItWorks.jsx';
import { Login } from './pages/public/Login.jsx';
import { Pricing } from './pages/public/Pricing.jsx';
import { Privacy } from './pages/public/Privacy.jsx';
import { ProductDetail } from './pages/public/ProductDetail.jsx';
import { Products } from './pages/public/Products.jsx';
import { Refund } from './pages/public/Refund.jsx';
import { Register } from './pages/public/Register.jsx';
import { Resources } from './pages/public/Resources.jsx';
import { Terms } from './pages/public/Terms.jsx';
import { TrackOrder } from './pages/public/TrackOrder.jsx';
import { BuyDSC } from './pages/customer/BuyDSC.jsx';
import { CustomerDashboard } from './pages/customer/CustomerDashboard.jsx';
import { DocumentsVault } from './pages/customer/DocumentsVault.jsx';
import { MyApplications } from './pages/customer/MyApplications.jsx';
import { MyOrders } from './pages/customer/MyOrders.jsx';
import { OrderDetails } from './pages/customer/OrderDetails.jsx';

const MissingPage = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-6 text-center">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">This workspace is coming soon</h1>
      <p className="mt-2 text-sm text-slate-500">Use the navigation to continue.</p>
    </div>
  </div>
);

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dsc-finder" element={<DSCFinder />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:slug" element={<ProductDetail />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/track-order" element={<TrackOrder />} />
    </Route>

    <Route path="/dashboard" element={<CustomerLayout />}>
      <Route index element={<CustomerDashboard />} />
      <Route path="buy" element={<BuyDSC />} />
      <Route path="orders" element={<MyOrders />} />
      <Route path="orders/:orderId" element={<OrderDetails />} />
      <Route path="applications" element={<MyApplications />} />
      <Route path="documents" element={<DocumentsVault />} />
      <Route path="invoices" element={<MissingPage />} />
      <Route path="renewals" element={<MissingPage />} />
      <Route path="support" element={<MissingPage />} />
      <Route path="profile" element={<MissingPage />} />
    </Route>

    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<MissingPage />} />
      <Route path="orders" element={<MissingPage />} />
      <Route path="kyc" element={<MissingPage />} />
      <Route path="users" element={<MissingPage />} />
      <Route path="tickets" element={<MissingPage />} />
      <Route path="settings" element={<MissingPage />} />
    </Route>

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
