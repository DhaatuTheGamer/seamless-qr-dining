import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';

import Button from '../Shared/Button';

const Dashboard: React.FC = () => {
    const { orders, updateOrderStatus, serviceRequests: requests, resolveServiceRequest: completeRequest } = useOrder();
    const [activeTab, setActiveTab] = useState<'orders' | 'requests'>('orders');

    // Sort orders by timestamp
    const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'delivered');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--secondary)] text-white p-6">
            <div className="container mx-auto max-w-[1600px]">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] mb-2">
                            Kitchen Display System
                        </h1>
                        <p className="text-gray-400 text-sm font-medium tracking-wide">LIVE ORDER MANAGEMENT</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-panel-dark px-6 py-3 rounded-xl flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Active Orders</span>
                            <span className="text-3xl font-bold text-white">{activeOrders.length}</span>
                        </div>
                        <div className="glass-panel-dark px-6 py-3 rounded-xl flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Requests</span>
                            <span className={`text-3xl font-bold ${requests.filter(r => r.status === 'pending').length > 0 ? 'text-[var(--accent)]' : 'text-white'}`}>
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-8 mb-10 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${activeTab === 'orders'
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Orders Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 px-2 font-bold text-sm uppercase tracking-widest transition-all border-b-2 ${activeTab === 'requests'
                            ? 'border-[var(--primary)] text-[var(--primary)]'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Service Requests
                        {requests.filter(r => r.status === 'pending').length > 0 && (
                            <span className="ml-3 bg-[var(--accent)] text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'orders' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {activeOrders.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-96 text-gray-600 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                                <span className="text-6xl mb-6 opacity-50">👨‍🍳</span>
                                <p className="text-xl font-medium text-gray-400">No active orders</p>
                                <p className="text-sm text-gray-600 mt-2">Waiting for new orders to arrive...</p>
                            </div>
                        ) : (
                            activeOrders.map(order => (
                                <div key={order.id} className="glass-panel-dark rounded-xl p-0 flex flex-col h-full hover:border-[var(--primary)]/30 transition-colors duration-300 overflow-hidden group">
                                    {/* Order Header */}
                                    <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-xl text-white">Table #{order.tableId}</h3>
                                                <span className="text-xs text-gray-500 font-mono">#{order.id.slice(-4)}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>🕒</span>
                                            {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                                        {order.items.map(item => (
                                            <div key={item.cartId} className="flex gap-4">
                                                <span className="font-bold text-[var(--primary)] bg-[var(--primary)]/10 w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0 border border-[var(--primary)]/20">
                                                    {item.quantity}
                                                </span>
                                                <div className="flex-1">
                                                    <span className="text-gray-200 font-medium block">{item.name}</span>
                                                    {item.notes && (
                                                        <p className="text-xs text-[var(--accent)] mt-2 italic bg-[var(--accent)]/10 p-2 rounded border border-[var(--accent)]/20">
                                                            "{item.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 border-t border-white/5 bg-white/[0.02] grid grid-cols-1 gap-3">
                                        {order.status === 'pending' && (
                                            <Button
                                                size="md"
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white border-0 w-full justify-center"
                                            >
                                                Start Preparing
                                            </Button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <Button
                                                size="md"
                                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                                className="bg-green-600 hover:bg-green-700 text-white border-0 w-full justify-center"
                                            >
                                                Mark Ready
                                            </Button>
                                        )}
                                        {order.status === 'ready' && (
                                            <Button
                                                size="md"
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                variant="outline"
                                                className="border-white/20 text-white hover:bg-white/10 w-full justify-center"
                                            >
                                                Complete Order
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                        {requests.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center h-96 text-gray-600 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                                <span className="text-6xl mb-6 opacity-50">🔔</span>
                                <p className="text-xl font-medium text-gray-400">No pending requests</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className={`glass-panel-dark rounded-xl p-6 text-white relative overflow-hidden ${req.status === 'pending' ? 'border-l-4 border-l-[var(--accent)]' : 'opacity-50'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="font-bold text-xl">Table #{req.tableId}</h3>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-3xl bg-white/5 p-2 rounded-lg">
                                                {req.type === 'water' ? '💧' : req.type === 'bill' ? '🧾' : req.type === 'help' ? '👋' : '💬'}
                                            </span>
                                            <span className="font-bold text-lg uppercase tracking-wider text-gray-200">
                                                {req.type}
                                            </span>
                                        </div>
                                        {req.message && (
                                            <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-lg italic border border-white/5">
                                                "{req.message}"
                                            </p>
                                        )}
                                    </div>

                                    {req.status === 'pending' ? (
                                        <Button
                                            size="sm"
                                            fullWidth
                                            onClick={() => completeRequest(req.id)}
                                            className="bg-[var(--accent)] hover:bg-red-700 border-0 text-white shadow-lg shadow-red-900/20"
                                        >
                                            Mark Completed
                                        </Button>
                                    ) : (
                                        <div className="text-center text-xs text-green-400 font-bold uppercase tracking-widest border border-green-500/30 bg-green-500/10 py-2 rounded-lg">
                                            Completed
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
