import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import TopUp from './pages/TopUp';
import TopUpDetail from './pages/TopUpDetail';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import ProductsManage from './pages/dashboard/ProductsManage';
import TopupManage from './pages/dashboard/TopupManage';
import Orders from './pages/dashboard/Orders';
import VideoManage from './pages/dashboard/VideoManage';
import AdminChat from './pages/dashboard/AdminChat';
import TechVideos from './pages/TechVideos';
import CustomerChat from './components/CustomerChat';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/*" element={
              <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flexGrow: 1 }}>
                  <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Store />} />
                <Route path="/topup" element={<TopUp />} />
                <Route path="/topup/:gameId" element={<TopUpDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/videos" element={<TechVideos />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-register" element={<AdminRegister />} />
              </Routes>
            </main>
            <Footer />
            <CustomerChat />
          </div>
        } />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<ProductsManage />} />
          <Route path="topup" element={<TopupManage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="videos" element={<VideoManage />} />
          <Route path="chat" element={<AdminChat />} />
        </Route>
      </Routes>
    </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
