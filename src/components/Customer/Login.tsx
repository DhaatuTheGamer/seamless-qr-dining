import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Shared/Button';
import Card from '../Shared/Card';

interface LoginProps {
    tableId: string;
}

const Login: React.FC<LoginProps> = ({ tableId }) => {
    const { login, loginAsGuest } = useAuth();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        setStep('otp');
    };

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[var(--primary)] to-transparent opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[var(--secondary)] to-transparent opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <Card glass className="w-full max-w-md p-0 overflow-hidden border-0 shadow-2xl animate-slide-up">
                <div className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-light)] p-10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-10 bg-cover bg-center"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-glow">
                            <span className="text-3xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-wide">Seamless Dining</h1>
                        <p className="text-white/70 font-light tracking-wider uppercase text-xs">Table #{tableId}</p>
                    </div>
                </div>

                <div className="p-8 bg-white/60 backdrop-blur-sm">
                    {step === 'phone' ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[var(--secondary)] uppercase tracking-wider mb-2">Full Name (Optional)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[var(--secondary)] uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                                    placeholder="Enter your mobile number"
                                    required
                                />
                            </div>

                            {error && <p className="text-[var(--accent)] text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </p>}

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                className="shadow-lg shadow-[var(--primary)]/30"
                            >
                                Continue
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                                    <span className="px-3 bg-white/60 text-gray-400">Or</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={loginAsGuest}
                                className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                            >
                                Continue as Guest
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-[var(--secondary)] font-medium">Enter the code sent to</p>
                                <p className="text-[var(--primary-dark)] font-bold text-lg">{phone}</p>
                                <p className="text-xs text-gray-400 mt-2 bg-gray-100 inline-block px-2 py-1 rounded">(Demo Code: 1234)</p>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-4 text-center text-3xl font-heading font-bold tracking-[0.5em] rounded-xl bg-white border border-gray-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                    placeholder="••••"
                                    maxLength={4}
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && <p className="text-[var(--accent)] text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                className="shadow-lg shadow-[var(--primary)]/30"
                            >
                                Verify & Login
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="w-full text-gray-400 text-xs font-bold uppercase tracking-wider hover:text-[var(--secondary)] transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </form>
                    )}
                </div>
            </Card>

            <p className="absolute bottom-6 text-center text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} Seamless Dining Experience
            </p>
        </div>
    );
};

export default Login;
