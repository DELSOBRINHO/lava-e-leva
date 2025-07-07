import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from "./services/supabaseClient";
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Header } from "./components/Header";
import { CategoryCard } from "./components/CategoryCard";
import { ServiceSelection } from "./client/ServiceSelection";
import { BasketSummary } from "./components/BasketSummary";
import { PartnerSelection } from "./partner/PartnerSelection";
import { OrderStatusTracker } from "./client/OrderStatusTracker";
// import StainHelper from './components/StainHelper';
import { Auth } from "./components/Auth";
import { OrderHistory } from "./components/OrderHistory";
import { CATEGORIES, PARTNERS, ITEMS } from "./constants";
import { AppView, OrderStatus } from './types';
import type { ServiceCategory, BasketItem, LaundryItem, LaundryPartner, Order } from './types';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [basket, setBasket] = useState<BasketItem[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [postLoginView, setPostLoginView] = useState<AppView | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = useCallback(async (userId: string) => {
        if (!supabase) return;
        try {
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;
            if (!ordersData) {
                setOrdersHistory([]);
                return;
            }

            const orderIds = (ordersData as any[]).map((o: any) => o.id);
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .in('order_id', orderIds);

            if (itemsError) throw itemsError;

            // Using mock partners for simplicity, in a real app, you'd fetch partners too
            const partners = PARTNERS;

            const history: Order[] = (ordersData as any[]).map((order: any) => {
                const partner = partners.find((p: LaundryPartner) => p.id === order.partner_id) || PARTNERS[0];
                const itemsForOrder = (itemsData as any[] | undefined)?.filter((i: any) => i.order_id === order.id) || [];
                
                const basketItems: BasketItem[] = itemsForOrder.map((item: any) => {
                    const laundryItem = ITEMS.find((li: LaundryItem) => li.id === item.item_id);
                    return {
                        ...(laundryItem || {} as LaundryItem),
                        id: item.item_id,
                        quantity: item.quantity,
                        price: parseFloat(item.price_at_time)
                    };
                });

                return {
                    id: order.id,
                    userId: order.user_id,
                    partner,
                    items: basketItems,
                    total: parseFloat(order.total),
                    status: order.status as OrderStatus,
                    created_at: order.created_at,
                };
            });

            setOrdersHistory(history);

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, []);

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
            setSession(data.session);
            if (data.session) {
                fetchOrders(data.session.user.id);
            }
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session);
            if (_event === 'SIGNED_IN') {
                if (session) fetchOrders(session.user.id);
                if (postLoginView) {
                    setCurrentView(postLoginView);
                    setPostLoginView(null);
                }
            }
             if (_event === 'SIGNED_OUT') {
                setOrdersHistory([]);
                handleGoHome();
            }
        });

        return () => subscription.unsubscribe();
    }, [postLoginView, fetchOrders]);


    const handleCategorySelect = useCallback((category: ServiceCategory) => {
        setSelectedCategory(category);
        setCurrentView(AppView.SERVICE_SELECTION);
    }, []);
    
    const handleGoHome = useCallback(() => {
        setCurrentView(AppView.HOME);
        setSelectedCategory(null);
        setBasket([]);
        setCurrentOrder(null);
    }, []);

    const updateBasket = useCallback((item: LaundryItem, quantity: number) => {
        setBasket(prevBasket => {
            const existingItemIndex = prevBasket.findIndex(i => i.id === item.id);
            const newBasket = [...prevBasket];

            if (quantity <= 0) {
                if (existingItemIndex > -1) {
                    newBasket.splice(existingItemIndex, 1);
                }
            } else {
                if (existingItemIndex > -1) {
                    newBasket[existingItemIndex] = { ...newBasket[existingItemIndex], quantity };
                } else {
                    newBasket.push({ ...item, quantity });
                }
            }
            return newBasket;
        });
    }, []);
    
    const handleConfirmBasket = useCallback(() => {
        if (session) {
            setCurrentView(AppView.PARTNER_SELECTION);
        } else {
            setPostLoginView(AppView.PARTNER_SELECTION);
            setCurrentView(AppView.AUTH);
        }
    }, [session]);

    const handlePartnerSelect = useCallback(async (partner: LaundryPartner) => {
        if (!session?.user || !supabase) return;

        const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: session.user.id,
                partner_id: partner.id,
                total: total,
                status: OrderStatus.REQUESTED,
            })
            .select()
            .single();
        
        if (orderError) {
            console.error("Error creating order:", orderError);
            return;
        }

        const orderItems = basket.map(item => ({
            order_id: orderData.id,
            item_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) {
            console.error("Error creating order items:", itemsError);
            // TODO: Handle this case, e.g., by deleting the created order
            return;
        }

        const newOrder: Order = {
            id: orderData.id,
            userId: session.user.id,
            partner,
            items: basket,
            total,
            status: OrderStatus.REQUESTED,
            created_at: orderData.created_at,
        };
        
        setCurrentOrder(newOrder);
        setOrdersHistory(prev => [newOrder, ...prev]);
        setBasket([]);
        setCurrentView(AppView.ORDER_TRACKING);
    }, [basket, session]);

    const handleNextOrderStatus = useCallback(async () => {
        if (!currentOrder || !supabase) return;

        const statusLevels = [
            OrderStatus.REQUESTED, OrderStatus.COLLECTED, OrderStatus.CLEANING,
            OrderStatus.READY_FOR_DELIVERY, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED
        ];
        
        const currentIndex = statusLevels.indexOf(currentOrder.status);
        if (currentIndex < statusLevels.length - 1) {
            const nextStatus = statusLevels[currentIndex + 1];

            const { error } = await supabase
                .from('orders')
                .update({ status: nextStatus })
                .eq('id', currentOrder.id);
            
            if(error) {
                console.error("Error updating order status:", error);
                return;
            }

            const updatedOrder = { ...currentOrder, status: nextStatus };
            setCurrentOrder(updatedOrder);
            setOrdersHistory(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        }
    }, [currentOrder]);
    
    const handleLoginClick = () => setCurrentView(AppView.AUTH);

    const handleViewHistory = () => setCurrentView(AppView.ORDER_HISTORY);

    const handleSelectOrderFromHistory = (order: Order) => {
        setCurrentOrder(order);
        setCurrentView(AppView.ORDER_TRACKING);
    };
    
    const handleLogout = async () => {
        if (supabase) {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Error logging out:', error);
        }
    };
    
    const handleLoginSuccess = () => {
        if (postLoginView) {
            setCurrentView(postLoginView);
            setPostLoginView(null);
        } else {
            setCurrentView(AppView.HOME);
        }
    };

    const renderView = () => {
        if (isLoading) {
            return <div className="text-center p-12">Carregando...</div>;
        }

        switch (currentView) {
            case AppView.AUTH:
                 return <Auth onLoginSuccess={handleLoginSuccess} />;
            case AppView.SERVICE_SELECTION:
                return selectedCategory && (
                    <ServiceSelection 
                        category={selectedCategory} 
                        basket={basket} 
                        updateBasket={updateBasket} 
                    />
                );
            case AppView.PARTNER_SELECTION:
                return <PartnerSelection onPartnerSelect={handlePartnerSelect} />;
            case AppView.ORDER_TRACKING:
                return currentOrder && <OrderStatusTracker order={currentOrder} onNextStep={handleNextOrderStatus} />;
            case AppView.ORDER_HISTORY:
                return <OrderHistory orders={ordersHistory} onSelectOrder={handleSelectOrderFromHistory} />;
            case AppView.HOME:
            default:
                return (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-800">Como podemos ajudar hoje?</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Sua rotina mais simples. Suas roupas, impecáveis. Escolha um serviço para começar.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            {CATEGORIES.map(cat => (
                                <CategoryCard key={cat.id} category={cat} onClick={() => handleCategorySelect(cat)} />
                            ))}
                        </div>
                        {/* <StainHelper /> */}
                    </div>
                );
        }
    };
    
    const showBasket = useMemo(() => {
        return currentView === AppView.SERVICE_SELECTION && basket.length > 0;
    }, [currentView, basket]);


    return (
        <div className="bg-gray-50 min-h-screen">
            <Header onLogoClick={handleGoHome} session={session} onLoginClick={handleLoginClick} onLogout={handleLogout} onViewHistory={handleViewHistory} />
            <main className="pb-32">
              {renderView()}
            </main>
            {showBasket && <BasketSummary basket={basket} onConfirm={handleConfirmBasket} />}
        </div>
    );
};

export default App;
