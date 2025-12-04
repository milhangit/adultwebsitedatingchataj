import Link from 'next/link';
import { Home } from 'lucide-react';

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-4xl font-bold text-primary mb-4">Coming Soon</h1>
                <p className="text-gray-500 mb-8">
                    We are working hard to bring you this feature. Please check back later!
                </p>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
