import { OrderStatus } from '../types';
import type { Order } from '../types';

interface OrderStatusTrackerProps {
  order: Order;
  onNextStep: () => void;
}

const statusLevels = [
  OrderStatus.REQUESTED,
  OrderStatus.COLLECTED,
  OrderStatus.CLEANING,
  OrderStatus.READY_FOR_DELIVERY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
];

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order, onNextStep }) => {
  const currentStatusIndex = statusLevels.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Acompanhe seu Pedido</h2>
            <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div>
                    <p className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</p>
                    <p className="text-lg font-semibold text-gray-800">{order.partner.name}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-blue-600">R$ {order.total.toFixed(2)}</p>
                </div>
            </div>

            <div className="relative">
                 {/* Line */}
                <div className="absolute left-4 top-4 h-full w-0.5 bg-gray-200" style={{ height: `calc(100% - 2rem)` }}></div>
                {statusLevels.map((status, index) => {
                    const isActive = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    return (
                        <div key={status} className="flex items-start mb-8 relative">
                            <div className={`z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {isActive ? <CheckCircleIcon className="w-8 h-8 text-white bg-blue-600 rounded-full p-1" /> : <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                            </div>
                            <div className="ml-4">
                                <p className={`font-bold ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>{status}</p>
                                {isCurrent && <p className="text-sm text-gray-500">Status atual do seu pedido.</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {order.status !== OrderStatus.DELIVERED && (
                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">(Para fins de demonstração, você pode avançar o status do pedido)</p>
                    <button
                        onClick={onNextStep}
                        className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-black transition-colors"
                    >
                        Avançar Status
                    </button>
                </div>
            )}
            {order.status === OrderStatus.DELIVERED && (
                 <div className="mt-8 text-center p-6 bg-green-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-700">Pedido Entregue!</h3>
                    <p className="text-green-600 mt-2">Agradecemos por usar o Lava & Leva. Esperamos ver você em breve!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default OrderStatusTracker;
