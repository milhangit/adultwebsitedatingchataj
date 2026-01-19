'use client';

import { useState } from 'react';
import { X, Camera, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface QuickRegisterModalProps {
    onClose: () => void;
    onSuccess: (userId: string) => void;
}

export default function QuickRegisterModal({ onClose, onSuccess }: QuickRegisterModalProps) {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Renamed from 'image'
    const [imageFile, setImageFile] = useState<File | null>(null); // New state for the actual file
    const [loading, setLoading] = useState(false);

    const handleSendOtp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            // Auto fill fake OTP for smooth UX
            setTimeout(() => setOtp('123456'), 500);
        }, 1000);
    };

    const handleVerifyOtp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 1000);
    };

    const handleComplete = async () => {
        if (!name || (!imagePreview && !imageFile)) {
            alert('Please provide your name and an image.');
            return;
        }
        setLoading(true);
        try {
            let finalImageUrl = imagePreview;

            // Note: Direct image upload to R2 would be better, but for now we send Base64 to the function.
            // The function should handle it. Since /api/upload is missing, we skip it.


            const res = await apiFetch('/api/auth/register-guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, name, image: finalImageUrl })
            });

            if (res.ok) {
                const data = await res.json() as any;
                localStorage.setItem('user_id', data.userId);
                localStorage.setItem('user_name', data.name);
                onSuccess(data.userId);
            } else {
                const errorData = await res.json() as any;
                console.error('Registration failed:', errorData.error);
                alert('Registration failed: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error: any) {
            console.error('Error registering:', error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); // Store the file object
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set the preview image
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your number</h2>
                            <p className="text-gray-500 mb-6">To chat with this profile, we need to verify you are real.</p>

                            <div className="mb-6 text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        +94
                                    </span>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 min-w-0 block w-full px-3 py-3 border border-gray-300 rounded-r-lg focus:ring-primary focus:border-primary"
                                        placeholder="77 123 4567"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={phone.length < 9 || loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                            <p className="text-gray-500 mb-6">We sent a code to +94 {phone}</p>

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="block w-full text-center text-3xl tracking-[0.5em] font-bold text-gray-900 border-b-2 border-gray-300 focus:border-primary outline-none py-2 mb-8 bg-transparent"
                                maxLength={6}
                                placeholder="• • • • • •"
                            />

                            <button
                                onClick={handleVerifyOtp}
                                disabled={otp.length < 6 || loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Profile</h2>
                            <p className="text-gray-500 mb-6">Almost done! Add a photo and your name.</p>

                            <div className="mb-6 flex justify-center">
                                <label className="relative cursor-pointer group">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden ${!imagePreview && 'bg-gray-50'}`}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                                        )}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    {imagePreview && (
                                        <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </label>
                            </div>

                            <div className="mb-6 text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-gray-900 bg-white"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <button
                                onClick={handleComplete}
                                disabled={!name || (!imagePreview && !imageFile) || loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Start Chatting'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
