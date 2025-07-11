import { Route } from 'react-router-dom';
import { LaundrySearch, ServiceSelection, OrderTracking } from '../pages/customer';
import { AvailableOrders, OrderFollowUp, DeliveryHistory } from '../pages/delivery';
import { OrdersPanel, OrdersHistory } from '../pages/laundry';
import { useAuth } from '../contexts/AuthContext';

export default function AppRoutes() {
  const { role } = useAuth();

  return (
    <>
      {role === 'customer' && (
        <>
          <Route path="/" element={<LaundrySearch />} />
          <Route path="/laundry/:laundryId/services" element={<ServiceSelection />} />
          <Route path="/orders" element={<OrderTracking />} />
        </>
      )}
      {role === 'delivery' && (
        <>
          <Route path="/" element={<AvailableOrders />} />
          <Route path="/my-orders" element={<OrderFollowUp />} />
          <Route path="/history" element={<DeliveryHistory />} />
        </>
      )}
      {role === 'laundry' && (
        <>
          <Route path="/" element={<OrdersPanel />} />
          <Route path="/history" element={<OrdersHistory />} />
        </>
      )}
    </>
  );
} 