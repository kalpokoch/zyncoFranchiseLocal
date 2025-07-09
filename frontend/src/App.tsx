import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import FranchiseSelect from './pages/FranchiseSelect';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import PaymentIn from './pages/PaymentIn';
import AddSales from './pages/AddSales';
import Inventory from './pages/Inventory';
import Purchase from './pages/Purchase';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import FranchiseForm from './pages/FranchiseForm';
import FranchiseList from './pages/FranchiseList';
import PaymentOut from './pages/PaymentOut';
import PaymentInHistory from './pages/PaymentInHistory';
import ManangeBDE from './pages/ManangeBDE';

import Supplier from './pages/Supplier';
import Customer from './pages/Customer';
import ManageCategory from './pages/manageCategory';

// Empty component for unclickable parent route
const EmptyPurchase = () => <div></div>;

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/franchise-select" element={<FranchiseSelect />} />
          <Route path="/add-franchise" element={<div className="max-w-md mx-auto py-8"><FranchiseForm /></div>} />
          
          <Route path="/:franchiseId/dashboard" element={<Dashboard />} />
          
          {/* Nested routes for Inventory */}
          <Route path="/:franchiseId/inventory">
            <Route index element={<Inventory />} />
            <Route path="category" element={<ManageCategory />} />
          </Route>

          <Route path="/:franchiseId/sales" element={<Sales />} />
          <Route path="/:franchiseId/sales/add" element={<AddSales />} />
          <Route path="/:franchiseId/payment-in" element={<PaymentIn />} />
          <Route path="/:franchiseId/payment-in-history" element={<PaymentInHistory />} />
          
          <Route path="/:franchiseId/customers" element={<Customer />} />

          <Route path="/:franchiseId/purchase" element={<EmptyPurchase />} />
          <Route path="/:franchiseId/purchase/history" element={<Purchase />} />
          <Route path="/:franchiseId/purchase/payment-out" element={<PaymentOut />} />
          
          <Route path="/:franchiseId/Supplier" element={<Supplier />} />

          <Route path="/:franchiseId/reports" element={<Reports />} />
          <Route path="/:franchiseId/bde" element={<ManangeBDE />} />
          <Route path="/:franchiseId/settings" element={<Settings />} />
                   
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
