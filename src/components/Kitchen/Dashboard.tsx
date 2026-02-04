import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOrder, Order } from '../../contexts/OrderContext';
import Button from '../Shared/Button';

/**
 * The kitchen dashboard component.
 * Displays orders in different states: New, Active (Preparing/Ready), and Completed.
 * Provides functionality to update order statuses and plays a notification sound for new orders.
 *
 * @component
 * @example
 * <Dashboard />
 *
 * @returns {JSX.Element} The rendered dashboard component.
 */
const Dashboard: React.FC = () => {
    const { orders, updateOrderStatus } = useOrder();
    const prevOrdersLength = useRef(orders.length);

    /**
     * Plays a notification sound for new orders using the Web Audio API.
     */
    const playNotificationSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    // Effect to check for new orders and trigger sound
    useEffect(() => {
        if (orders.length > prevOrdersLength.current) {
            playNotificationSound();
        }
        prevOrdersLength.current = orders.length;
    }, [orders.length]);

    // Group orders by status
    const { newOrders, activeOrders, completedOrders } = useMemo(() => {
        const newList: Order[] = [];
        const activeList: Order[] = [];
        const completedList: Order[] = [];

        for (const order of orders) {
            if (order.status === 'pending') {
                newList.push(order);
            } else if (order.status === 'preparing' || order.status === 'ready') {
                activeList.push(order);
            } else if (order.status === 'delivered' || order.status === 'completed') {
                completedList.push(order);
            }
        }

        return {
            newOrders: newList,
            activeOrders: activeList,
            completedOrders: completedList
        };
    }, [orders]);

    /**
     * Helper to format time elapsed since the order was placed.
     * @param timestamp - The order timestamp.
     * @returns {string} Formatted time string (e.g., "5m ago").
     */
    const getTimeAgo = (timestamp: number) => {
        const diff = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
        if (diff < 1) return 'Just now';
        return `${diff}m ago`;
    };

    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-4 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 bg-[#0f172a] p-4 rounded-xl border border-white/5 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="text-blue-500 text-2xl">🍴</div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Seamless Dining</h1>
                        <p className="text-xs text-gray-400">Kitchen Dashboard</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-[#1e293b] rounded-lg border border-white/10 text-sm font-medium text-gray-300">
                        Main Kitchen
                    </div>
                    <div className="px-4 py-2 bg-[#1e293b] rounded-lg border border-white/10 text-sm font-medium text-gray-300">
                        Staff: Alex
                    </div>
                </div>
            </header>

            {/* Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

                {/* New Orders Column */}
                <div className="flex flex-col bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 bg-[#2563eb] text-white font-bold flex justify-between items-center">
                        <span>New Orders</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{newOrders.length}</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                        {newOrders.map(order => (
                            <div key={order.id} className="bg-[#1e293b] rounded-lg p-4 border border-white/5 hover:border-[#2563eb]/50 transition-colors shadow-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Order #{order.id.slice(-4)}</h3>
                                        <p className="text-xs text-red-400 font-bold">{getTimeAgo(order.timestamp)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">Table {order.tableId}</div>
                                        <div className="text-xs text-gray-400">{order.items.length} Items</div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-300 flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm py-2"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-gray-300 hover:bg-white/5 text-sm py-2"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Orders Column */}
                <div className="flex flex-col bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 bg-[#f59e0b] text-white font-bold flex justify-between items-center">
                        <span>Active Orders</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{activeOrders.length}</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                        {activeOrders.map(order => (
                            <div key={order.id} className="bg-[#1e293b] rounded-lg p-4 border border-white/5 hover:border-[#f59e0b]/50 transition-colors shadow-lg relative overflow-hidden">
                                {order.status === 'ready' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 font-bold">PLATED</div>}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Order #{order.id.slice(-4)}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${order.status === 'preparing' ? 'text-[#f59e0b]' : 'text-green-400'}`}>
                                                {order.status === 'preparing' ? 'Cooking' : 'Plating'}
                                            </span>
                                            <span className="text-xs text-gray-500">({getTimeAgo(order.timestamp)})</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">Table {order.tableId}</div>
                                        <div className="text-xs text-gray-400">{order.items.length} Items</div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-300 flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {order.status === 'preparing' && (
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 overflow-hidden">
                                        <div className="bg-[#f59e0b] h-full w-[60%]"></div>
                                    </div>
                                )}
                                {order.status === 'ready' && (
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 overflow-hidden">
                                        <div className="bg-green-500 h-full w-[90%]"></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    {order.status === 'preparing' ? (
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'ready')}
                                            className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm py-2"
                                        >
                                            Mark Plated
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2"
                                        >
                                            Complete
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-gray-300 hover:bg-white/5 text-sm py-2"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Completed Orders Column */}
                <div className="flex flex-col bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 bg-[#10b981] text-white font-bold flex justify-between items-center">
                        <span>Completed Orders</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{completedOrders.length}</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                        {completedOrders.map(order => (
                            <div key={order.id} className="bg-[#1e293b] rounded-lg p-4 border border-white/5 opacity-75 hover:opacity-100 transition-opacity shadow-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Order #{order.id.slice(-4)}</h3>
                                        <p className="text-xs text-gray-500">Completed {getTimeAgo(order.timestamp)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">Table {order.tableId}</div>
                                        <div className="text-xs text-green-400 flex items-center justify-end gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Done
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-400 truncate">
                                            {item.quantity}x {item.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-gray-400 hover:bg-white/5 text-xs py-1.5"
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-white/10 text-gray-400 hover:bg-white/5 text-xs py-1.5"
                                    >
                                        Print Receipt
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
