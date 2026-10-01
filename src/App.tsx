import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CustomerLayout } from './components/layout/CustomerLayout';

// Customer Pages (22 pages)
import { HomePage } from './pages/customer/HomePage';
import { CategoriesPage } from './pages/customer/CategoriesPage';
import { AllProductsPage } from './pages/customer/AllProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { SearchPage } from './pages/customer/SearchPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { LoginPage } from './pages/customer/LoginPage';
import { SignUpPage } from './pages/customer/SignUpPage';
import { ForgotPasswordPage } from './pages/customer/ForgotPasswordPage';
import { MyAccountPage } from './pages/customer/MyAccountPage';
import { EditProfilePage } from './pages/customer/EditProfilePage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { WalletPage } from './pages/customer/WalletPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { AboutUsPage } from './pages/customer/AboutUsPage';
import { ContactUsPage } from './pages/customer/ContactUsPage';
import { PrivacyPolicyPage } from './pages/customer/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/customer/TermsConditionsPage';
import { SettingsPage } from './pages/customer/SettingsPage';

// Admin Layout & Sections
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminWalletsPage } from './pages/admin/AdminWalletsPage';
import { AdminDepositsPage } from './pages/admin/AdminDepositsPage';
import { AdminWithdrawalsPage } from './pages/admin/AdminWithdrawalsPage';
import { AdminWalletTransactionsPage } from './pages/admin/AdminWalletTransactionsPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminAdsPage } from './pages/admin/AdminAdsPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminWebsiteSettingsPage } from './pages/admin/AdminWebsiteSettingsPage';
import { AdminLogoManagementPage } from './pages/admin/AdminLogoManagementPage';
import { AdminDataExportPage } from './pages/admin/AdminDataExportPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';
import { AdminAccountPage } from './pages/admin/AdminAccountPage';
import { Logo } from './components/brand/Logo';

const AppContent: React.FC = () => {
  const {
    isAdminMode,
    isAdminAuthenticated,
    isAdmin,
    adminSection,
    currentRoute,
    authLoading
  } = useStore();

  // Initial Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Logo variant="compact" />
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // Separate Admin Portal Routing with Strict RBAC
  if (isAdminMode) {
    if (!isAdminAuthenticated || !isAdmin) {
      return <AdminLoginPage />;
    }

    return (
      <AdminLayout>
        {adminSection === 'dashboard' && <AdminDashboardPage />}
        {adminSection === 'products' && <AdminProductsPage />}
        {adminSection === 'categories' && <AdminCategoriesPage />}
        {adminSection === 'orders' && <AdminOrdersPage />}
        {adminSection === 'customers' && <AdminCustomersPage />}
        {adminSection === 'wallets' && <AdminWalletsPage />}
        {adminSection === 'deposits' && <AdminDepositsPage />}
        {adminSection === 'withdrawals' && <AdminWithdrawalsPage />}
        {adminSection === 'transactions' && <AdminWalletTransactionsPage />}
        {adminSection === 'banners' && <AdminBannersPage />}
        {adminSection === 'ads' && <AdminAdsPage />}
        {adminSection === 'coupons' && <AdminCouponsPage />}
        {adminSection === 'notifications' && <AdminNotificationsPage />}
        {adminSection === 'settings' && <AdminWebsiteSettingsPage />}
        {adminSection === 'logo' && <AdminLogoManagementPage />}
        {adminSection === 'export' && <AdminDataExportPage />}
        {adminSection === 'security' && <AdminSecurityPage />}
        {adminSection === 'admin-account' && <AdminAccountPage />}
      </AdminLayout>
    );
  }

  // Customer Storefront Routing (22 Pages)
  return (
    <CustomerLayout>
      {currentRoute === 'home' && <HomePage />}
      {currentRoute === 'categories' && <CategoriesPage />}
      {currentRoute === 'products' && <AllProductsPage />}
      {currentRoute === 'product-detail' && <ProductDetailPage />}
      {currentRoute === 'search' && <SearchPage />}
      {currentRoute === 'cart' && <CartPage />}
      {currentRoute === 'wishlist' && <WishlistPage />}
      {currentRoute === 'checkout' && <CheckoutPage />}
      {currentRoute === 'login' && <LoginPage />}
      {currentRoute === 'signup' && <SignUpPage />}
      {currentRoute === 'forgot-password' && <ForgotPasswordPage />}
      {currentRoute === 'account' && <MyAccountPage />}
      {currentRoute === 'edit-profile' && <EditProfilePage />}
      {currentRoute === 'orders' && <MyOrdersPage />}
      {currentRoute === 'order-detail' && <OrderDetailPage />}
      {currentRoute === 'wallet' && <WalletPage />}
      {currentRoute === 'notifications' && <NotificationsPage />}
      {currentRoute === 'about' && <AboutUsPage />}
      {currentRoute === 'contact' && <ContactUsPage />}
      {currentRoute === 'privacy' && <PrivacyPolicyPage />}
      {currentRoute === 'terms' && <TermsConditionsPage />}
      {currentRoute === 'settings' && <SettingsPage />}
    </CustomerLayout>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
