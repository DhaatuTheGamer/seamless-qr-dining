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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-3xl">
                        🍽️
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Seamless Dining</h1>
                    <p className="text-gray-500 text-sm uppercase tracking-wide">Table #{tableId}</p>
                </div>

                {step === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                placeholder="Enter your mobile number"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                        >
                            Continue
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                                <span className="px-3 bg-white text-gray-400">Or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={loginAsGuest}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                        >
                            Continue as Guest
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 font-medium">Enter the code sent to</p>
                            <p className="text-gray-900 font-bold text-lg">{phone}</p>
                            <p className="text-xs text-gray-400 mt-2 bg-gray-100 inline-block px-2 py-1 rounded">(Demo Code: 1234)</p>
                        </div>

                        <div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                placeholder="••••"
                                maxLength={4}
                                required
                                autoFocus
                            />
                        </div>

                        {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                        >
                            Verify & Login
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep('phone')}
                            className="w-full text-gray-400 text-xs font-bold uppercase tracking-wider hover:text-gray-600 transition-colors"
                        >
                            Change Phone Number
                        </button>
                    </form>
                )}
            </Card>

            <p className="absolute bottom-6 text-center text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} Seamless Dining Experience
            </p>
        </div>
    );
};

export default Login;
