import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { View } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RetailerDashboard from './pages/RetailerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import { MOCK_PRODUCTS } from './constants';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>(View.HOME);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const { user, role } = useAuth();
    const { cart } = useCart();
    const { addNotification } = useNotifications();

    useEffect(() => {
        // Simulate generating notifications on app load
        if (role === 'retailer' && user) {
            const retailerProducts = MOCK_PRODUCTS.filter(p => p.retailerId === user.id);
            retailerProducts.forEach(product => {
                const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                    addNotification(`Your product "${product.name}" is expiring in ${daysUntilExpiry} days.`, 'warning');
                }
            });
        } else if (role === 'buyer') {
             addNotification('New deals in the Dairy category have been listed!', 'info');
             addNotification('Fresh bakery items are 50% off today.', 'info');
        }
    }, [user, role, addNotification]);


    const navigate = (view: View, productId?: number) => {
        setCurrentView(view);
        if (productId) {
            setSelectedProductId(productId);
        } else {
            setSelectedProductId(null);
        }
        window.scrollTo(0, 0);
    };

    const renderContent = () => {
        if (!user) {
            switch (currentView) {
                case View.HOME:
                    return <HomePage navigate={navigate} />;
                case View.PRODUCT_DETAIL:
                     return selectedProductId ? <ProductDetailPage productId={selectedProductId} navigate={navigate} /> : <HomePage navigate={navigate} />;
                default:
                    return <LoginPage navigate={navigate} />;
            }
        }

        switch (currentView) {
            case View.HOME:
                return <HomePage navigate={navigate} />;
            case View.PRODUCT_DETAIL:
                return selectedProductId ? <ProductDetailPage productId={selectedProductId} navigate={navigate} /> : <HomePage navigate={navigate} />;
            case View.CART:
                return <CartPage navigate={navigate} />;
            case View.RETAILER_DASHBOARD:
                return role === 'retailer' ? <RetailerDashboard navigate={navigate} /> : <HomePage navigate={navigate} />;
            case View.ADMIN_DASHBOARD:
                return role === 'admin' ? <AdminDashboard navigate={navigate} /> : <HomePage navigate={navigate} />;
            default:
                if (role === 'admin') {
                    setCurrentView(View.ADMIN_DASHBOARD);
                    return <AdminDashboard navigate={navigate} />;
                }
                if (role === 'retailer') {
                    setCurrentView(View.RETAILER_DASHBOARD);
                    return <RetailerDashboard navigate={navigate} />;
                }
                setCurrentView(View.HOME);
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Header navigate={navigate} cartCount={cart.length} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <NotificationProvider>
                    <AppContent />
                </NotificationProvider>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;