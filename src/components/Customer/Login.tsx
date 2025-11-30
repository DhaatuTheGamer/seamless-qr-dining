import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Shared/Button';
import Card from '../Shared/Card';
import { useRouter } from 'next/navigation';

/**
 * Props for the Login component.
 */
interface LoginProps {
    /** The initial table ID passed via query parameter or default. */
    tableId: string;
}

/**
 * The login and welcome screen component.
 * Handles table number entry, guest access, and phone number authentication with simulated OTP.
 *
 * @component
 * @example
 * <Login tableId="table-1" />
 *
 * @param {LoginProps} props - The component props.
 * @returns {JSX.Element} The rendered login component.
 */
const Login: React.FC<LoginProps> = ({ tableId: initialTableId }) => {
    const { login, loginAsGuest } = useAuth();
    const router = useRouter();
    const [tableInput, setTableInput] = useState(initialTableId);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'welcome' | 'login_phone' | 'login_otp'>('welcome');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Navigates to the menu for the specified table.
     * Logs the user in as a guest if not already authenticated.
     */
    const handleViewMenu = () => {
        if (tableInput && tableInput !== initialTableId) {
            router.push(`/?table=${tableInput}`);
        }
        loginAsGuest();
    };

    /**
     * Handles sending the OTP code (simulated).
     * @param e - Form submission event.
     */
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setError('');
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setStep('login_otp');
    };

    /**
     * Verifies the OTP code and logs the user in.
     * Uses a hardcoded OTP '1234' for demonstration.
     * @param e - Form submission event.
     */
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);

        if (otp === '1234') {
            login(name || 'Customer', phone);
        } else {
            setError('Invalid OTP. Try 1234');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f0eb] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center blur-sm opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-[#f5f0eb]/90"></div>
            </div>

            <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 relative z-10">
                {step === 'welcome' && (
                    <div className="text-center space-y-8 animate-fade-in">
                        <div className="space-y-2">
                            <div className="flex justify-center mb-6">
                                <span className="text-4xl">🍽️</span>
                            </div>
                            <h1 className="text-3xl font-bold text-[#3d312e] tracking-tight">
                                Welcome to Seamless<br />Dining.
                            </h1>
                            <h2 className="text-2xl font-bold text-[#3d312e] tracking-tight">
                                Let's Get Started.
                            </h2>
                            <p className="text-[#8b7e78] text-sm mt-4 leading-relaxed max-w-xs mx-auto">
                                Enter your table number to view the menu and order.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🪑</span>
                                </div>
                                <input
                                    type="text"
                                    value={tableInput}
                                    onChange={(e) => setTableInput(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a0522d]/20 focus:border-[#a0522d] transition-all"
                                    placeholder="Enter Table Number"
                                />
                            </div>

                            <Button
                                onClick={handleViewMenu}
                                fullWidth
                                size="lg"
                                className="bg-[#a0522d] hover:bg-[#8b4513] text-white shadow-lg shadow-[#a0522d]/20 py-4 text-lg font-bold rounded-xl"
                            >
                                View Menu
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                                <span className="px-4 bg-transparent text-gray-500 backdrop-blur-xl bg-white/50">OR</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-sm text-[#5c504a]">
                                <span>Already have an account?</span>
                                <Button
                                    onClick={() => setStep('login_phone')}
                                    variant="ghost"
                                    className="p-0 h-auto text-[#a0522d] font-bold hover:bg-transparent hover:underline"
                                >
                                    Log In
                                </Button>
                            </div>

                            <Button
                                onClick={handleViewMenu}
                                variant="ghost"
                                className="text-[#8b7e78] text-sm hover:text-[#3d312e] hover:bg-transparent underline decoration-gray-300 underline-offset-4"
                            >
                                Continue as Guest
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'login_phone' && (
                    <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#3d312e]">Welcome Back</h2>
                            <p className="text-[#8b7e78] text-sm">Enter your details to login</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#5c504a] mb-1.5">Full Name (Optional)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#a0522d] focus:ring-2 focus:ring-[#a0522d]/20 outline-none transition-all bg-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#5c504a] mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#a0522d] focus:ring-2 focus:ring-[#a0522d]/20 outline-none transition-all bg-white"
                                    placeholder="Enter your mobile number"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                className="bg-[#a0522d] hover:bg-[#8b4513] text-white shadow-lg shadow-[#a0522d]/20 py-3.5 rounded-xl font-bold"
                            >
                                Get OTP
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => setStep('welcome')}
                                className="text-[#8b7e78] hover:text-[#3d312e]"
                            >
                                Back
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'login_otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#3d312e]">Verify OTP</h2>
                            <p className="text-[#8b7e78] text-sm">Code sent to <span className="font-bold text-[#3d312e]">{phone}</span></p>
                            <p className="text-xs text-[#a0522d] mt-2 bg-[#a0522d]/5 inline-block px-2 py-1 rounded font-medium">Demo Code: 1234</p>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-5 text-center text-3xl font-bold tracking-[0.5em] rounded-xl border border-gray-200 focus:border-[#a0522d] focus:ring-4 focus:ring-[#a0522d]/10 outline-none transition-all bg-white"
                                placeholder="••••"
                                maxLength={4}
                                required
                                autoFocus
                            />
                        </div>

                        {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                        <div className="space-y-3 pt-2">
                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                className="bg-[#a0522d] hover:bg-[#8b4513] text-white shadow-lg shadow-[#a0522d]/20 py-3.5 rounded-xl font-bold"
                            >
                                Verify & Login
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('login_phone')}
                                className="w-full text-[#8b7e78] text-xs font-bold uppercase tracking-wider hover:text-[#3d312e] transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </div>
                    </form>
                )}
            </Card>

            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-[#8b7e78] text-xs font-medium">
                    &copy; {new Date().getFullYear()} Seamless Dining Experience
                </p>
            </div>
        </div>
    );
};

export default Login;
