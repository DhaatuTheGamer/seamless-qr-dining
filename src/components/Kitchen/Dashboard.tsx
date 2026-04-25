import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOrder, Order, OrderStatus } from '../../contexts/OrderContext';
import Button from '../Shared/Button';
import Modal from '../Shared/Modal';
import { CATEGORIES, menuItems } from '../../data/menu';

export const groupOrdersByStatus = (orders: Order[]) => {
    const newOrders: Order[] = [];
    const activeOrders: Order[] = [];
    const completedOrders: Order[] = [];

    for (const order of orders) {
        if (order.status === 'pending') {
            newOrders.push(order);
        } else if (order.status === 'preparing' || order.status === 'ready') {
            activeOrders.push(order);
        } else if (order.status === 'delivered' || order.status === 'completed') {
            completedOrders.push(order);
        }
    }

    return {
        newOrders,
        activeOrders,
        completedOrders
    };
};

const Dashboard: React.FC = () => {
    const { orders, updateOrderStatus, isKitchenSlammed, toggleKitchenSlammed, unavailableItems, toggleItemAvailability } = useOrder();
    const prevOrdersLength = useRef(orders.length);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    // New UX State
    const [searchQuery, setSearchQuery] = useState('');
    const [station, setStation] = useState('All');
    const [isBatchView, setIsBatchView] = useState(false);
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
    const [undoStack, setUndoStack] = useState<{ id: string, orderId: string, oldStatus: OrderStatus, text: string }[]>([]);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 30_000);
        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        if (orders.length > prevOrdersLength.current) {
            playNotificationSound();
        }
        prevOrdersLength.current = orders.length;
    }, [orders.length]);

    // Handle Undo action
    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        const oldStatus = order.status;
        updateOrderStatus(orderId, newStatus);
        
        const undoId = crypto.randomUUID();
        setUndoStack(prev => [...prev, { id: undoId, orderId, oldStatus, text: `Order #${orderId.slice(-4)} -> ${newStatus}` }]);
        
        setTimeout(() => {
            setUndoStack(prev => prev.filter(u => u.id !== undoId));
        }, 5000);
    };

    const handleUndo = (undoId: string) => {
        const action = undoStack.find(u => u.id === undoId);
        if (action) {
            updateOrderStatus(action.orderId, action.oldStatus);
            setUndoStack(prev => prev.filter(u => u.id !== undoId));
        }
    };

    const toggleItemComplete = (orderId: string, itemId: string) => {
        const key = `${orderId}-${itemId}`;
        setCompletedItems(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    // Filter orders by search and station
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  order.tableId.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            if (station !== 'All') {
                const hasCategory = order.items.some(item => item.category === station);
                if (!hasCategory) return false;
            }
            return true;
        }).map(order => {
            if (station === 'All') return order;
            // Only show items for the selected station
            return {
                ...order,
                items: order.items.filter(item => item.category === station)
            };
        });
    }, [orders, searchQuery, station]);

    const { newOrders, activeOrders, completedOrders } = useMemo(() => groupOrdersByStatus(filteredOrders), [filteredOrders]);

    // Batch View Aggregation
    const batchItems = useMemo(() => {
        const counts: Record<string, { name: string, quantity: number, notes: string[] }> = {};
        activeOrders.forEach(order => {
            order.items.forEach(item => {
                if (!counts[item.id]) {
                    counts[item.id] = { name: item.name, quantity: 0, notes: [] };
                }
                counts[item.id].quantity += item.quantity;
                if (item.notes) counts[item.id].notes.push(item.notes);
            });
        });
        return Object.values(counts);
    }, [activeOrders]);

    const getTimeAgo = (timestamp: number) => {
        const diff = Math.floor((currentTime - timestamp) / 60000);
        if (diff < 1) return 'Just now';
        return `${diff}m ago`;
    };

    const getUrgencyClass = (timestamp: number) => {
        const diff = Math.floor((currentTime - timestamp) / 60000);
        if (diff >= 20) return 'border-red-500 animate-pulse border-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
        if (diff >= 10) return 'border-yellow-500 border-2 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
        return 'border-white/5';
    };

    return (
        <div className="min-h-screen bg-[#1e293b] text-white p-4 font-sans flex flex-col relative">
            
            {/* Local Undo Toasts */}
            <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {undoStack.map(undo => (
                    <div key={undo.id} className="bg-gray-800 border border-gray-600 p-4 rounded-lg shadow-xl pointer-events-auto flex items-center justify-between gap-4 animate-fade-in w-72">
                        <span className="text-sm text-gray-200">{undo.text}</span>
                        <button onClick={() => handleUndo(undo.id)} className="text-blue-400 font-bold hover:text-blue-300 px-2 py-1 rounded bg-blue-400/10 transition">Undo</button>
                    </div>
                ))}
            </div>

            {/* Header */}
            <header className="flex flex-wrap justify-between items-center mb-6 bg-[#0f172a] p-4 rounded-xl border border-white/5 shadow-lg gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-blue-500 text-2xl">🍴</div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Seamless Dining</h1>
                        <p className="text-xs text-gray-400">Kitchen Dashboard</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <input 
                        type="text" 
                        placeholder="Search Table or Order #" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 w-48"
                    />
                    
                    <select 
                        value={station}
                        onChange={(e) => setStation(e.target.value)}
                        className="bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">All Stations</option>
                        {CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>

                    <button 
                        onClick={() => setIsBatchView(!isBatchView)}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${isBatchView ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#1e293b] border-white/10 text-gray-300 hover:bg-white/5'}`}
                    >
                        {isBatchView ? 'Ticket View' : 'Batch View'}
                    </button>

                    <button 
                        onClick={() => setIsInventoryModalOpen(true)}
                        className="px-4 py-2 rounded-lg border border-white/10 text-sm font-bold bg-[#1e293b] text-gray-300 hover:bg-white/5 transition-colors"
                    >
                        Manage Inventory
                    </button>

                    <button 
                        onClick={toggleKitchenSlammed}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${isKitchenSlammed ? 'bg-red-600 border-red-500 text-white animate-pulse' : 'bg-[#1e293b] border-white/10 text-gray-300 hover:bg-white/5'}`}
                    >
                        {isKitchenSlammed ? 'THROTTLED' : 'Kitchen Normal'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            {isBatchView ? (
                <div className="flex-1 bg-[#0f172a] rounded-xl border border-white/5 p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Active Batch Aggregation</h2>
                    {batchItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 text-lg">No active items to batch.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {batchItems.map((item, idx) => (
                                <div key={idx} className="bg-[#1e293b] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-xl text-white">{item.name}</h3>
                                        <span className="bg-blue-500 text-white font-bold px-3 py-1 rounded-lg text-xl">{item.quantity}</span>
                                    </div>
                                    {item.notes.length > 0 && (
                                        <div className="mt-auto pt-4 space-y-2">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Modifications</p>
                                            {item.notes.map((note, nIdx) => (
                                                <div key={nIdx} className="bg-yellow-500 text-black text-xs p-2 rounded font-bold shadow-sm">
                                                    {note}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
                    
                    {/* New Orders Column */}
                    <div className="flex flex-col bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-[#2563eb] text-white font-bold flex justify-between items-center">
                            <span className="text-lg">New Orders</span>
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{newOrders.length}</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {newOrders.map(order => (
                                <div key={order.id} className={`bg-[#1e293b] rounded-xl p-5 hover:border-[#2563eb]/50 transition-colors shadow-lg ${getUrgencyClass(order.timestamp)}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-white">Order #{order.id.slice(-4)}</h3>
                                            <p className="text-sm text-red-400 font-bold">{getTimeAgo(order.timestamp)}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-white">Table {order.tableId}</div>
                                            <div className="text-sm text-gray-400">{order.items.length} Items</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-5">
                                        {order.items.map((item) => (
                                            <div key={item.cartId} className="text-base text-gray-200">
                                                <div className="flex justify-between font-medium">
                                                    <span>{item.quantity}x {item.name}</span>
                                                </div>
                                                {item.notes && (
                                                    <div className="bg-yellow-500 text-black font-bold p-2 rounded text-sm mt-1 mb-1 shadow-sm">
                                                        Note: {item.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={() => handleUpdateStatus(order.id, 'preparing')} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-base py-3">
                                            Accept
                                        </Button>
                                        <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 text-base py-3">
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
                            <span className="text-lg">Active Orders</span>
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{activeOrders.length}</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {activeOrders.map(order => (
                                <div key={order.id} className={`bg-[#1e293b] rounded-xl p-5 hover:border-[#f59e0b]/50 transition-colors shadow-lg relative overflow-hidden ${getUrgencyClass(order.timestamp)}`}>
                                    {order.status === 'ready' && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 font-bold tracking-wider">PLATED</div>}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-white">Order #{order.id.slice(-4)}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${order.status === 'preparing' ? 'text-[#f59e0b]' : 'text-green-400'}`}>
                                                    {order.status === 'preparing' ? 'Cooking' : 'Plating'}
                                                </span>
                                                <span className="text-sm text-gray-500">({getTimeAgo(order.timestamp)})</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-white">Table {order.tableId}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-5">
                                        {order.items.map((item) => {
                                            const isDone = completedItems.has(`${order.id}-${item.id}`);
                                            return (
                                                <div 
                                                    key={item.cartId} 
                                                    onClick={() => toggleItemComplete(order.id, item.id)}
                                                    className={`p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5 border border-transparent hover:border-white/10 ${isDone ? 'opacity-50 grayscale' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start text-base">
                                                        <span className={`font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    </div>
                                                    {item.notes && !isDone && (
                                                        <div className="bg-yellow-500 text-black font-bold p-2 rounded text-sm mt-1 shadow-sm">
                                                            Note: {item.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {order.status === 'preparing' && (
                                        <div className="w-full bg-gray-700 h-2 rounded-full mb-5 overflow-hidden">
                                            <div className="bg-[#f59e0b] h-full w-[60%]"></div>
                                        </div>
                                    )}
                                    {order.status === 'ready' && (
                                        <div className="w-full bg-gray-700 h-2 rounded-full mb-5 overflow-hidden">
                                            <div className="bg-green-500 h-full w-[90%]"></div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        {order.status === 'preparing' ? (
                                            <Button onClick={() => handleUpdateStatus(order.id, 'ready')} className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-base py-3">
                                                Mark Plated
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="bg-green-600 hover:bg-green-700 text-white text-base py-3">
                                                Complete
                                            </Button>
                                        )}
                                        <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 text-base py-3">
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
                            <span className="text-lg">Completed Orders</span>
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{completedOrders.length}</span>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {completedOrders.map(order => (
                                <div key={order.id} className="bg-[#1e293b] rounded-xl p-5 border border-white/5 opacity-75 hover:opacity-100 transition-opacity shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-xl text-white">Order #{order.id.slice(-4)}</h3>
                                            <p className="text-sm text-gray-500">Completed {getTimeAgo(order.timestamp)}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-white">Table {order.tableId}</div>
                                            <div className="text-sm text-green-400 flex items-center justify-end gap-1 font-bold mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                Done
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-5">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="text-base text-gray-400 line-through truncate">
                                                {item.quantity}x {item.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={() => handleUpdateStatus(order.id, 'ready')} className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b]/10 text-base py-2">
                                            Undo Complete
                                        </Button>
                                        <Button variant="outline" className="border-white/10 text-gray-400 hover:bg-white/5 text-base py-2">
                                            Print Receipt
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Management Modal */}
            {isInventoryModalOpen && (
                <Modal isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)} title="Manage Inventory (86 Items)">
                    <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
                        <p className="text-gray-500 text-sm mb-4">Toggle items below to mark them as Sold Out. They will immediately become unavailable on the customer menus.</p>
                        {CATEGORIES.map(category => {
                            const itemsInCategory = menuItems.filter(item => item.category === category.id);
                            if (itemsInCategory.length === 0) return null;
                            return (
                                <div key={category.id} className="mb-6">
                                    <h3 className="font-bold text-[#3d312e] text-lg mb-3 border-b pb-2">{category.label}</h3>
                                    <div className="space-y-2">
                                        {itemsInCategory.map(item => {
                                            const isOut = unavailableItems.includes(item.id);
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <div>
                                                        <p className={`font-medium ${isOut ? 'text-gray-400 line-through' : 'text-[#3d312e]'}`}>{item.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleItemAvailability(item.id)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${isOut ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-600 border border-green-200'}`}
                                                    >
                                                        {isOut ? 'Sold Out (86)' : 'Available'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
