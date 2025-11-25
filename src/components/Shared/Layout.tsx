import { useOrder } from '../../contexts/OrderContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { setIsCartOpen, cart } = useOrder();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
                            S
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                            Seamless Dining
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Menu</a>
                        <a href="#" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">History</a>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-600 hover:text-emerald-600 font-medium transition-colors relative"
                        >
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-emerald-700 transition-all">
                            Call Staff
                        </button>
                    </nav>

                    <button className="md:hidden text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-20 pb-24 px-4 container mx-auto animate-fade-in">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    <a href="#" className="flex flex-col items-center gap-1 text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="text-[10px] font-medium">Menu</span>
                    </a>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors relative"
                    >
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">Cart</span>
                    </button>
                    <a href="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-emerald-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span className="text-[10px] font-medium">Orders</span>
                    </a>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
