'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, User, Mail, Lock, CheckCircle, ArrowRight, Smartphone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCarrier, carrierLogos, isValidSLNumber, Carrier } from '@/lib/sl-carriers';
import Image from 'next/image';

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        gender: 'Female',
    });
    const [carrier, setCarrier] = useState<Carrier>('Unknown');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'mobileNumber') {
            setCarrier(getCarrier(value));
        }
    };

    const handleGenderSelect = (gender: string) => {
        setFormData({ ...formData, gender });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.mobileNumber && !isValidSLNumber(formData.mobileNumber)) {
            setError('Please enter a valid Sri Lankan mobile number');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    gender: formData.gender,
                    mobileNumber: formData.mobileNumber,
                }),
            });

            let data;
            try {
                // Attempt to parse JSON
                const text = await res.text();
                data = text ? JSON.parse(text) : {};
            } catch (e) {
                console.error('Failed to parse response:', e);
                data = { error: 'Server returned an invalid response' };
            }

            if (!res.ok) {
                throw new Error(data.error || `Registration failed (${res.status})`);
            }

            // Success
            router.push('/login?registered=true');
        } catch (err: any) {
            console.error('Registration Error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="bg-primary p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Heart className="w-6 h-6 text-white fill-current" />
                        </div>
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light" style={{ fontFamily: 'var(--font-outfit)' }}>
                            DateSL
                        </span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('auth_register_title')}</h2>
                    <p className="text-gray-500">{t('auth_register_subtitle')}</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {/* Gender Selection - Touch Friendly */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1 block">{t('auth_gender_label')}</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleGenderSelect('Male')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${formData.gender === 'Male'
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm scale-105'
                                    : 'border-gray-100 bg-white text-gray-400 hover:border-primary/30 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-full ${formData.gender === 'Male' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm">{t('auth_gender_male')}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleGenderSelect('Female')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${formData.gender === 'Female'
                                    ? 'border-primary bg-primary/5 text-primary shadow-sm scale-105'
                                    : 'border-gray-100 bg-white text-gray-400 hover:border-primary/30 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-full ${formData.gender === 'Female' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm">{t('auth_gender_female')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="w-full bg-white/50 border border-gray-200 text-gray-900 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-gray-400 font-medium"
                                placeholder={t('auth_fullname_placeholder')}
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                id="mobileNumber"
                                name="mobileNumber"
                                type="tel"
                                className="w-full bg-white/50 border border-gray-200 text-gray-900 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-gray-400 font-medium pl-12 pr-16"
                                placeholder="Mobile Number (07...)"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />
                            {/* Carrier Logo Preview */}
                            {carrier !== 'Unknown' && carrierLogos[carrier] && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300">
                                    <div className="w-8 h-8 relative bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                        <Image
                                            src={carrierLogos[carrier]}
                                            alt={carrier}
                                            fill
                                            className="object-contain p-0.5"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full bg-white/50 border border-gray-200 text-gray-900 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-gray-400 font-medium"
                                placeholder={t('auth_email_placeholder')}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full bg-white/50 border border-gray-200 text-gray-900 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-gray-400 font-medium"
                                placeholder={t('auth_password_placeholder')}
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full bg-white/50 border border-gray-200 text-gray-900 rounded-xl px-12 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base placeholder:text-gray-400 font-medium"
                                placeholder={t('auth_password_confirm_placeholder')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {/* T&C Checkbox */}
                        <div className="flex items-start gap-3 ml-1">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                </label>
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !agreedToTerms}
                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {t('auth_register_button')}
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-gray-600 mt-6">
                        {t('auth_already_have_account')}{' '}
                        <Link href="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                            {t('auth_signin_link')}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
