import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                            Sithumina
                        </Link>
                        <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                            Sri Lanka's most trusted matrimonial service. We help you find your perfect life partner with cultural values at heart.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/about" className="text-base text-gray-500 hover:text-primary">About Us</Link></li>
                            <li><Link href="/careers" className="text-base text-gray-500 hover:text-primary">Careers</Link></li>
                            <li><Link href="/blog" className="text-base text-gray-500 hover:text-primary">Blog</Link></li>
                            <li><Link href="/contact" className="text-base text-gray-500 hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/privacy" className="text-base text-gray-500 hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-base text-gray-500 hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="text-base text-gray-500 hover:text-primary">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
                        <div className="flex space-x-6 mt-4">
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} Sithumina Matrimony. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
