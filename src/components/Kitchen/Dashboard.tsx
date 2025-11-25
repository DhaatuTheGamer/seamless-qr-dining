import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import Card from '../Shared/Card';
import Button from '../Shared/Button';

const Dashboard: React.FC = () => {
    const { orders, updateOrderStatus, serviceRequests: requests, resolveServiceRequest: completeRequest } = useOrder();
    const [activeTab, setActiveTab] = useState<'orders' | 'requests'>('orders');

    // Sort orders by timestamp
    const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'delivered');


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--secondary)] text-white p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-[var(--primary)]">Kitchen Display System</h1>
                        <p className="text-gray-400 text-sm mt-1">Live Order Management</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Active Orders</span>
                            <span className="text-2xl font-bold text-white">{activeOrders.length}</span>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                            <span className="block text-xs text-gray-400 uppercase tracking-wider">Pending Requests</span>
                            <span className="text-2xl font-bold text-[var(--accent)]">{requests.filter(r => r.status === 'pending').length}</span>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'orders'
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Orders Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'requests'
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Service Requests
                        {requests.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-2 bg-[var(--accent)] text-white text-[10px] px-2 py-0.5 rounded-full">
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'orders' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeOrders.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                                <span className="text-4xl mb-4">👨‍🍳</span>
                                <p className="text-lg font-medium">No active orders</p>
                            </div>
                        ) : (
                            activeOrders.map(order => (
                                <Card key={order.id} className="bg-white/5 border-white/10 text-white flex flex-col h-full hover:border-[var(--primary)]/50 transition-colors">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/10">
                                        <div>
                                            <h3 className="font-bold text-lg">Table #{order.tableId}</h3>
                                            <span className="text-xs text-gray-400">Order #{order.id.slice(-4)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-60 custom-scrollbar">
                                        {order.items.map(item => (
                                            <div key={item.cartId} className="flex justify-between items-start text-sm">
                                                <div className="flex gap-3">
                                                    <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 w-6 h-6 flex items-center justify-center rounded text-xs shrink-0">
                                                        {item.quantity}
                                                    </span>
                                                    <div>
                                                        <span className="text-gray-200 font-medium">{item.name}</span>
                                                        {item.notes && (
                                                            <p className="text-xs text-[var(--accent)] mt-1 italic bg-[var(--accent)]/10 p-1 rounded">
                                                                Note: {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-white/10 grid grid-cols-1 gap-2">
                                        {order.status === 'pending' && (
                                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                                                Start Preparing
                                            </Button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')} className="bg-green-600 hover:bg-green-700 border-green-600 text-white">
                                                Mark Ready
                                            </Button>
                                        )}
                                        {order.status === 'ready' && (
                                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                                Complete Order
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {requests.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                                <span className="text-4xl mb-4">🔔</span>
                                <p className="text-lg font-medium">No pending requests</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <Card key={req.id} className={`bg-white/5 border-white/10 text-white ${req.status === 'pending' ? 'border-l-4 border-l-[var(--accent)]' : 'opacity-50'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg">Table #{req.tableId}</h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">
                                                {req.type === 'water' ? '💧' : req.type === 'bill' ? '🧾' : req.type === 'help' ? '👋' : '💬'}
                                            </span>
                                            <span className="font-bold text-xl uppercase tracking-wide">
                                                {req.type}
                                            </span>
                                        </div>
                                        {req.message && (
                                            <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg italic border border-white/5">
                                                "{req.message}"
                                            </p>
                                        )}
                                    </div>

                                    {req.status === 'pending' ? (
                                        <Button
                                            size="sm"
                                            fullWidth
                                            onClick={() => completeRequest(req.id)}
                                            className="bg-[var(--accent)] hover:bg-red-600 border-[var(--accent)] text-white"
                                        >
                                            Mark Completed
                                        </Button>
                                    ) : (
                                        <div className="text-center text-sm text-green-400 font-bold uppercase tracking-wider border border-green-500/30 bg-green-500/10 py-2 rounded">
                                            Completed
                                        </div>
                                    )}
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
