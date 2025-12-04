import { redirect } from 'next/navigation';

export default function ProfileIndex() {
    // For now, redirect to login as we don't have auth state persistence in this demo
    redirect('/login');
}
