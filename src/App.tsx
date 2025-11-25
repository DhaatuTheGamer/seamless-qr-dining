import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import Login from './components/Customer/Login';
import Menu from './components/Customer/Menu';
import Dashboard from './components/Kitchen/Dashboard';

import Layout from './components/Shared/Layout';

const CustomerApp = () => {
  const { isAuthenticated } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const tableId = urlParams.get('table') || '1';

  if (!isAuthenticated) {
    return (
      <Layout>
        <Login tableId={tableId} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Menu tableId={tableId} />
    </Layout>
  );
};

const AppContent = () => {
  const path = window.location.pathname;

  if (path === '/kitchen') {
    return <Dashboard />;
  }

  return <CustomerApp />;
};

import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Shared/ToastContainer';

// ... imports

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <OrderProvider>
          <AppContent />
          <ToastContainer />
        </OrderProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
